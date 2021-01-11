//
//  FileBrowser.m
//  App
//
//  Created by David Keimig on 10/17/20.
//

#import <Capacitor/Capacitor.h>

CAP_PLUGIN(FileBrowser, "FileBrowser",
  CAP_PLUGIN_METHOD(open, CAPPluginReturnPromise);
)
