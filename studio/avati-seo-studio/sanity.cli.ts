import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'bv8ffbbk',
    dataset: 'production'
  },
  studioHost: 'avati-safe-storage',
  deployment: {
    appId: 'qsgdksifxnf20uxrlbn5scum',
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/studio/latest-version-of-sanity#k47faf43faf56
     */
    autoUpdates: true,
  }

})

