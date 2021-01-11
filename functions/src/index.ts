import * as functions from 'firebase-functions';
const fetch = require('node-fetch');
const admin = require('firebase-admin');
const stripe = require('stripe')('sk_test_51GqsISKpkA8a3GwiIGnpuM1LCrzrGMzJ57O2LPPbAH2G4UWvCrkgMUHsdsQuqG4q9XGPg2JtMtrIXXFIZvPOUK4u00dAfZASwR');
const serviceAccount = require('./creds.json');
const { Client } = require('@elastic/elasticsearch');
const elasticClient = new Client({ 
  node: 'https://be7e5c9241aa4148b74b0216584caebd.us-central1.gcp.cloud.es.io:9243',
  auth: {
    username: 'elastic',
    password: '0XLqxrHxTYq9XJxTlmcmHWXr'
  }
});

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://print-3aa78.firebaseio.com",
});
const firestore = admin.firestore();
firestore.settings({ ignoreUndefinedProperties: true });

export const getToken = functions.https.onCall(async (data, context) => {
  const uid = context?.auth?.uid;
  if (uid) {
    const customToken = await admin.auth().createCustomToken(uid);
    return customToken;
  }
  return null;
});

export const deletePrint = functions.firestore.document('prints/{uid}/files/{file}').onDelete(async (change, context) => {
  const { uid, file } = context.params;
  const { filePath, fileBucket, thumbnailPath } = change.data();
  const bucket = admin.storage().bucket(fileBucket);
  let requests = [];
  const thumbs = await firestore.collection(`prints/${uid}/files/${file}/thumbnails`).get();
  thumbs.forEach((doc: any) => {
    requests.push(doc.ref.delete());
  });  
  requests.push(bucket.file(filePath).delete());
  requests.push(bucket.file(thumbnailPath).delete());
  await Promise.all(requests);
});

export const deleteThumb = functions.firestore.document('prints/{uid}/files/{file}/thumbnails/{thumb}').onDelete(async (change, context) => {
  const { path, fileBucket } = change.data();
  const bucket = admin.storage().bucket(fileBucket);
  await bucket.file(path).delete();
});

export const createStripeUser = functions.auth.user().onCreate(async (user) => {
  const userDocument = firestore.doc(`users/${user.uid}`);
  const stripeDocument = firestore.doc(`stripe/${user.uid}`);

  const customer = await stripe.customers.create({
    email: user.email,
    metadata: {
      uid: user.uid,
    },
  });
  
  let requests = [];
  requests.push(userDocument.set({stripeId: customer.id, ...JSON.parse(JSON.stringify(user))}));
  requests.push(stripeDocument.set(JSON.parse(JSON.stringify(customer))));
  await Promise.all(requests);
});

export const updateProfileURL = functions.storage.object().onFinalize(async (object) => {
  const fileBucket = object.bucket;
  const filePath = object.name;
  if (filePath!.startsWith("files/")) {
    const parts = filePath!.split("/");
    let suffix = parts[parts.length - 1];
    const bucket = admin.storage().bucket(fileBucket);
    const file = bucket.file(filePath);
    const response = await file.getMetadata();
    const metadata = response[0].metadata;
    const urlRef = firestore.collection(`prints/${metadata.uid}/files/`).doc(suffix);
    let requests = [];
    const trimExt = suffix.split(".")[0];
    const trimParts = trimExt.split('_');
    const displayName = trimParts.slice(1).join('_');
    requests.push(urlRef.set({
      fileBucket: fileBucket,
      filePath: filePath,
      displayName,
      metadata
    }));
    requests.push(file.getSignedUrl({
      action: 'read',
      expires: '03-09-2491'
    }));
    const results = await Promise.all(requests);
    const urls = results[1];
    await fetch("http://35.226.119.93:3000", { 
      headers: {'Content-Type': 'application/json'}, 
      method: "POST",
      body: JSON.stringify({ 
        url: urls[0],
        name: metadata.name,
        uid: metadata.uid,
      })
    })
  } else if (filePath!.startsWith("thumbnails/") && filePath!.includes("resized")) {
    const parts = filePath!.split("/");
    const suffix = parts[parts.length - 1];
    const bucket = admin.storage().bucket(fileBucket);
    const file = bucket.file(filePath);
    const response = await file.getMetadata();
    const metadata = response[0].metadata;
    const imageRef = firestore.collection(
      `prints/${metadata.uid}/files/${metadata.name}/thumbnails/`
    ).doc(suffix);
    await imageRef.set({
      path: filePath,
      fileBucket,
    });
  } else {
    const bucket = admin.storage().bucket(fileBucket);
    const file = bucket.file(filePath);
    const response = await file.getMetadata();
    const metadata = response[0].metadata;
    const imageRef = firestore.collection(
      `prints/${metadata.uid}/files/`
    ).doc(metadata.name);
    await imageRef.set({
      thumbnailPath: filePath,
    }, {merge: true}); 
  }
  return true;
});

export const searchPrinter = functions.https.onCall(async (data, context) => {
  const result = await elasticClient.search({
    index: 'user_printers',
    body: data
  }, {
    maxRetries: 3
  });

  if (result && result.body && result.body.hits && result.body.hits.hits) {
    return result.body.hits.hits;
  }
  
  return false;
});

