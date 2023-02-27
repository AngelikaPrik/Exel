import { ExcelStateComponent } from './../../core/ExcelStateComponent'
import { ExcelComponent } from './../../core/ExcelComponent'
import { IStore } from './../../core/createStore'
import { Dom } from './../../core/dom'
import { StoreSubscriber } from '../../core/StoreSubscriber'
import { Emitter } from '../../core/Emitter'
import { $ } from '../../core/dom'

export class Excel {
  $el: Dom
  components: any[]
  store: IStore
  emitter: Emitter
  subscriber: StoreSubscriber

  constructor(selector: string, options: IOptions) {
    this.$el = $(selector)
    this.components = options.components || []
    this.store = options.store
    this.emitter = new Emitter()
    this.subscriber = new StoreSubscriber(this.store)
  }

  getRoot() {
    const $root = $.create('div', 'excel')

    const componentOptions = {
      emitter: this.emitter,
      store: this.store,
    }

    this.components = this.components.map(Component => {
      const $el = $.create('div', Component.className)
      const component = new Component($el, componentOptions)
      $el.html(component.toHTML())
      $root.append($el)

      return component
    })

    return $root
  }

  render() {
    this.$el.append(this.getRoot())
    this.subscriber.subscribeComponents(this.components)
    this.components.forEach(component => component.init())
  }

  destroy() {
    this.subscriber.unsubscribeFromStore()
    this.components.forEach(component => component.destroy())
  }
}

interface IOptions {
  components: any[]
  store: IStore
}