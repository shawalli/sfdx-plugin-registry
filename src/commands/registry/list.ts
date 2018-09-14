import { core, SfdxCommand } from '@salesforce/command';
import { format } from 'url';
import { get } from 'https';

// Initialize Messages with the current plugin directory
core.Messages.importMessagesDirectory(__dirname);

// Load the specific messages for this file. Messages from @salesforce/command, @salesforce/core,
// or any library that is using the messages framework can also be loaded this way.
const messages = core.Messages.loadMessages('sfdx-plugin-registry', 'list');

export default class List extends SfdxCommand {

  public static description = messages.getMessage('commandDescription');

  public static examples = [
    `$ sfdx registry:list
  Plugin Name           Plugin Description
  sfdx-hello-world      Sample plugin.
  `
  ];

  protected static requiresUsername = false;

  protected static supportsDevhubUsername = false;

  protected static requiresProject = false;

  private static registry_url = "https://skimdb.npmjs.com/registry/_design/app/_view/dependedUpon?group_level=3&startkey=%5B%22@salesforce/command%22%5D&endkey=%5B%22@salesforce/command%22%2C%7B%7D%5D&skip=0&limit=1000";

  public async run(): Promise<core.AnyJson> {
    // The output and --json will automatically be handled for you.
    // if (!result.records || result.records.length <= 0) {
    //   throw new core.SfdxError(messages.getMessage('errorNoOrgResults', [this.org.getOrgId()]));
    // }

    let dependedUponUrl = format({
      protocol: 'https',
      host: 'skimdb.npmjs.com/registry/_design/app/_view/dependedUpon',
      query: {
        group_level: 3,
        startkey: `["@salesforce/command"]`,
        endkey: `["@salesforce/command",{}]`,
        skip: 0,
        limit: 1000
      });

    this.ux.log("Hello registry!");

    // Return an object to be displayed with --json
    return {};
  }
}
