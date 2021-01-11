//
//  FileBrowser.swift
//  App
//
//  Created by David Keimig on 10/17/20.
//

import Capacitor
import FirebaseAuth
import FirebaseStorage

@objc(FileBrowser)
public class FileBrowser: CAPPlugin {
    @objc func open(_ call: CAPPluginCall) {
        DispatchQueue.main.async {
            let token = call.getString("token") ?? ""
            let dp = DocumentPicker(plugin: self, token: token, documentTypes: ["public.data"], in: .open)
            self.bridge.viewController.present(dp, animated: true, completion: nil)
        }
    }
}

class DocumentPicker: UIDocumentPickerViewController, UIDocumentPickerDelegate {
    var plugin: CAPPlugin?
    var token: String?
    
    init(plugin: CAPPlugin, token: String, documentTypes allowedUTIs: [String], in mode: UIDocumentPickerMode) {
        self.plugin = plugin
        self.token = token
        super.init(documentTypes: allowedUTIs, in: mode)
        self.delegate = self
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    func documentPicker(_ controller: UIDocumentPickerViewController, didPickDocumentsAt urls: [URL]) {
        DispatchQueue.main.async {
            Auth.auth().signIn(withCustomToken: self.token!) {(result, error) in
                let storage = Storage.storage()
                let storageRef = storage.reference()
                for url in urls {
                    do {
                        guard url.startAccessingSecurityScopedResource() else { return }
                        let timestamp = Date().currentTimeMillis()
                        let name = "\(timestamp)_\(url.lastPathComponent)"
                        let data = try Data(contentsOf: url)
                        let uid = result?.user.uid ?? "UNAUTHENTICATED"
                        let fileRef = storageRef.child("files/\(uid)/\(name)")
                        let metadata = StorageMetadata()
                        metadata.customMetadata = [
                            "uid": uid,
                            "name": name,
                        ]
                        let uploadTask = fileRef.putData(data, metadata: metadata) { metadata, error in
                            url.stopAccessingSecurityScopedResource()
                        }
                        uploadTask.observe(.progress) { snapshot in
                            let percentComplete = 100.0 * Double(snapshot.progress!.completedUnitCount)/Double(snapshot.progress!.totalUnitCount)
                            self.plugin?.notifyListeners("didPickDocumentsAt", data: ["progress": percentComplete])
                        }
                    } catch {
                        url.stopAccessingSecurityScopedResource()
                        self.plugin?.notifyListeners("didPickDocumentsAt", data: ["progress": false])
                    }
                }
            }
        }
    }
}

extension Date {
    func currentTimeMillis() -> Int64 {
        return Int64(self.timeIntervalSince1970 * 1000)
    }
}
