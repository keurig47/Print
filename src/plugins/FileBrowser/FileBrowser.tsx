import { WebPlugin } from '@capacitor/core';

export class FileBrowser extends WebPlugin {
  constructor() {
    super({
      name: 'FileBrowser',
      platforms: ['web']
    });
  }

  async open(options: any) {
    return options;  
  }
}

const FileBrowserPlugin = new FileBrowser();
export default FileBrowserPlugin;
