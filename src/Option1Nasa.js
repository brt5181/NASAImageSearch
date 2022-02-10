import { LitElement, css, html } from 'lit';
import '@lrnwebcomponents/accent-card/accent-card.js';

class imageSearch extends LitElement {
  constructor() {
    super();
    this.term = "";
    this.image = [];
    this.title = [];
    this.description = [];
    this.secondary_creator = "";
    this.page = 1;
    // this.media_type = "";
  }

  static get properties() {
    return {
      image: {type: Array},
      title: {type: Array},
      description: {type: Array},
      secondary_creator: {type: String},
      term: {type: String},
      page: {type: Number}
    };
  }

   firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    this.getData();
  }

   updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName === 'term' && this[propName]) {
        this.getData();
      }
      else if (propName === 'page' && this[propName]) {
        this.getData();
      }
    });
  }

  async getData() {
    // special JS capability to resolve a URL path relative to the current file
    // if (this.page === null)
    // {
    //   const file = new URL(`https://images-api.nasa.gov/search?q=${this.term}&media_type=image`);
    // }
    // else if {
    //   const file = new URL(`https://images-api.nasa.gov/search?q=${this.term}&media_type=image&page=${this.page}`);
    // }

    const file = new URL(`https://images-api.nasa.gov/search?q=${this.term}&media_type=image&page=${this.page}`);

    // go get our data from the file
    await fetch(file) // sends an HTTP get request to the URL
      .then(response =>
        // convert to json; I skip the .ok here because it's a local file
        // but remote requests should check for a valid response
        response.json()
      )
      .then(data => { // sends the requested data back
        this.image = [];
        // many ways to loop here -- https://www.codespot.org/ways-to-loop-through-an-array-in-javascript/#:~:text=6%20Ways%20to%20Loop%20Through%20an%20Array%20in,callback%20function%20for%20each%20element%20in%20the%20array.
        // for loop runs synchronously though
        // this line prevents the linter from being mad since this is kinda a crappy old way of doing this :)
        // details: https://masteringjs.io/tutorials/eslint/ignore#:~:text=You%20can%20use%20comments%20to%20disable%20all%20ESLint,root%20directory..eslintignore%20syntax%20is%20similar%20to%20that%20of.gitignore.
        /* eslint-disable */
        for (let i = 0; i < data.collection.items.length; i++) 
        {
          // the API we're drawing in is confusing, let's simplify for internal usage to our element
          const eventInfo = {
            image: data.collection.items[i].links[0].href,
            title: data.collection.items[i].data[0].title,
            description: data.collection.items[i].data[0].description,
            secondary_creator: data.collection.items[i].data[0].secondary_creator,
            page: data.collection.items[i].data[0].page
          };
          // brute force; just pull what looks like a date off the front for 01-31-22 format
          
          this.image.push(eventInfo);
        }
        
        // tell the browser to wait for 1 second before setting this back to what it was
        setTimeout(() => {
          this.loadData = false;
        }, 1000);
      });
  }


  static get styles() {
    return css`
      :host {
        display: block;
        /* border: 2px solid black; */
        min-height: 100px;
      }
      date-card {
        display: inline-flex;
      }
      :host([view='list']) ul {
        margin: 20px;
      }
    `;
  }

  updateSearchTerm()
  {
    this.term = this.shadowRoot.querySelector('#term').value;
    this.page = this.shadowRoot.querySelector('#page').value;
  }

  render() {
    return html`
     <label for="term">Search for image:</label><br> 
          <input type="text" id="term" name="term"><br>
          <label for="page"> Enter Page Number</label><br>
          <input type="number" id="page" name="page"><br>
          <button @click=${this.updateSearchTerm}>Submit</button>
          
      ${this.view === 'list'
        ? html`
            <ul>
              ${this.image.map(
                item => html`
                  <li>
                  ${item.image} - ${item.title} - ${item.description} - ${item.secondary_creator}
                  </li>
                `
              )}
            </ul>
          `
        : html`
          <br> </br>
            ${this.image.map(
              item => html`
                <accent-card
                image-src="${item.image}"
                accent-color="green"
                horizontal
                style="max-width:1000px;"
              >
                <div slot="heading">${item.title}</div>
                <div slot="content">${item.description}</div>
                <div slot="Secondary Creator">${item.secondary_creator}</div>
              </accent-card>
              `
            )}
          `}
    `;
  }
}

customElements.define('image-search', imageSearch);

