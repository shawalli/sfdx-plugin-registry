import { core, SfdxCommand } from '@salesforce/command';
import * as request from 'request-promise-native';

// Initialize Messages with the current plugin directory
core.Messages.importMessagesDirectory(__dirname);

// Load the specific messages for this file. Messages from @salesforce/command, @salesforce/core,
// or any library that is using the messages framework can also be loaded this way.
const messages = core.Messages.loadMessages('sfdx-plugin-registry', 'list');

export default class List extends SfdxCommand {

  public static description = messages.getMessage('commandDescription');

  public static examples = [
    `$ sfdx registry:list
  PLUGIN NAME           DESCRIPTION
  sfdx-hello-world      Sample plugin.
  `
  ];

  protected static requiresUsername = false;

  protected static supportsDevhubUsername = false;

  protected static requiresProject = false;

  private static registry_url = 'https://skimdb.npmjs.com/registry/_design/app/_view/dependedUpon?group_level=3&startkey=%5B%22@salesforce/command%22%5D&endkey=%5B%22@salesforce/command%22%2C%7B%7D%5D&skip=0&limit=1000';

  public async run(): Promise<core.AnyJson> {
    // The output and --json will automatically be handled for you.
    // if (!result.records || result.records.length <= 0) {
    //   throw new core.SfdxError(messages.getMessage('errorNoOrgResults', [this.org.getOrgId()]));
    // }

    var options = {
      uri: 'https://skimdb.npmjs.com/registry/_design/app/_view/dependedUpon',
      qs: {
        group_level: 3,
        startkey: `["@salesforce/command"]`,
        endkey: `["@salesforce/command",{}]`,
        skip: 0,
        limit: 1000
      },
      json: true
    };

    const response = await request(options);

    var pluginTable: { string: string }[] = [];
    for (var plugin of response.rows) {
      pluginTable.push({ 'plugin name': plugin.key[1], 'description': plugin.key[2] });
    }
    this.ux.table(
      pluginTable,
      {
        columns: ['plugin name', 'description']
      }
    );

    // Return an object to be displayed with --json
    return {};
  }
}
