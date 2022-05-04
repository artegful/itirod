const ROUTE_CHANGED_EVENT_NAME = 'routechanged'

export class Router {
  constructor () {
    this._eventSource = document.createElement('div')

    this._routeChanged = new CustomEvent(ROUTE_CHANGED_EVENT_NAME,
      {
        bubbles: true,
        cancelable: false
      })

    this._route = this.WindowRoute
    window.addEventListener('popstate', () => {
      if (this.WindowRoute !== this._route) {
        this._route = this.WindowRoute
        this._eventSource.dispatchEvent(this._routeChanged)
      }
    })
  }

  SetRoute (route) {
    window.location.hash = route
    this._route = route
  }

  get Route () {
    return this._route
  }

  get WindowRoute () {
    return window.location.hash.replace(/[^\w\s]/gi, '')
  }

  AddRouteChangedListener (handler) {
    this._eventSource.addEventListener(ROUTE_CHANGED_EVENT_NAME, () => {
      handler(this._route)
    })
  }
}
