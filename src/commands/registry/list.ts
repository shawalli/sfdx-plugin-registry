import { core, SfdxCommand } from '@salesforce/command';
// import * as url from 'url';
import * as request from 'request';

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

    this.ux.log(options);

    // request(options)
    //   .then(function (plugins) {
    //     this.ux.log('NPM has %d plugins', plugins.length);
    //     this.ux.log(plugins);
    //   })
    //   .catch(function (err) {
    //     this.ux.log('err:' + err);
    //   });

    request(options, function (error, response, body) {
      if (error) {
        this.ux.error(err);
      } else {
        console.log('-----------------');
        var plugins = body.rows;
        for (let plugin of plugins) {

          var name = plugin.key[1];
          var description = plugin.key[2];
          // console.log(plugin);
          console.log(name + '::::' + description);
        }
        console.log('NPM has %d plugins', body.rows.length);
      }
    });
    // this.ux.log('NPM has %d plugins', plugins.length);

    // let dependedUponUrl = url.format({
    //   protocol: 'https',
    //   host: 'skimdb.npmjs.com/registry/_design/app/_view/dependedUpon',
    //   query: {
    //     group_level: 3,
    //     startkey: `['@salesforce/command']`,
    //     endkey: `['@salesforce/command',{}]`,
    //     skip: 0,
    //     limit: 1000
    //   });

    this.ux.log('Hello registry!');

    // Return an object to be displayed with --json
    return {};
  }
}
