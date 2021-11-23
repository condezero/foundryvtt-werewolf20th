/**
 * Extend the base Actor entity by defining a custom roll data structure which is ideal for the Simple system.
 * @extends {Actor}
 */
 export class WerewolfActor extends Actor {
    /**
       * Augment the basic actor data with additional dynamic data.
       */
    prepareData () {
      super.prepareData()
    }
  

  
    /**
     * Redefines the create "actor" type with translations :)
     * @param {object} data         Initial data with which to populate the creation form
     * @param {object} [options]    Positioning and sizing options for the resulting dialog
     * @return {Promise<Document>}  A Promise which resolves to the created Document
     * @memberof ClientDocumentMixin
     */
    static async createDialog (data = {}, options = {}) {
      // Collect data
      const documentName = this.metadata.name
      const types = game.system.entityTypes[documentName]
      const folders = game.folders.filter(f => (f.data.type === documentName) && f.displayed)
      const label = game.i18n.localize(this.metadata.label)
      const title = game.i18n.format('ENTITY.Create', { entity: label })
  
      const index = types.indexOf('character')
      if (index !== -1) {
        types.splice(index, 1)
      }
  
      // Render the entity creation form
      const html = await renderTemplate('templates/sidebar/entity-create.html', {
        name: data.name || game.i18n.format('ENTITY.New', { entity: label }),
        folder: data.folder,
        folders: folders,
        hasFolders: folders.length > 1,
        type: data.type || types[0],
        types: types.reduce((obj, t) => {
          const were20Label = 'were20.' + t[0].toUpperCase() + t.substring(1)
          obj[t] = game.i18n.has(were20Label) ? game.i18n.localize(were20Label) : t
          return obj
        }, {}),
        hasTypes: types.length > 1
      })
  
      // Render the confirmation dialog window
      return Dialog.prompt({
        title: title,
        content: html,
        label: title,
        callback: html => {
          const form = html[0].querySelector('form')
          const fd = new FormDataExtended(form)
          data = foundry.utils.mergeObject(data, fd.toObject())
          if (!data.folder) delete data.folder
          if (types.length === 1) data.type = types[0]
          return this.create(data, { renderSheet: true })
        },
        rejectClose: false,
        options: options
      })
    }
  }
  