class ChemicalInput extends HTMLInputElement {
    connectedCallback() {
      this.addEventListener("keydown", async function (e) {
        if (e.key === "Enter" && window.chemical.loaded && e.target.value) {
          const service =
            this.dataset.serviceStore !== undefined
              ? localStorage.getItem("@chemical/service") ||
                this.dataset.service ||
                "uv"
              : this.dataset.service || "uv";
          const autoHttps =
            this.dataset.autoHttpsStore !== undefined
              ? localStorage.getItem("@chemical/autoHttps") === "true" 
              : !!this.dataset.autoHttps;
          const searchEngine =
            this.dataset.searchEngineStore !== undefined
              ? localStorage.getItem("@chemical/searchEngine")
              : this.dataset.searchEngine;
          const action = this.dataset.action;
          const target = this.dataset.target;
          const frame = this.dataset.frame;
          const encodedURL = await chemical.encode(e.target.value, {
            service,
            autoHttps,
            searchEngine,
          });
  
          if (frame) {
            const forFrame = document.getElementById(frame);
            forFrame.src = encodedURL;
            forFrame.setAttribute("data-open", "true");
          }
  
          if (action) {
            window[action](encodedURL);
          }
  
          if (target) {
            if (target === "_self") {
              window.location = encodedURL;
            } else if (target === "_blank") {
              window.open(encodedURL);
            }
          }
        }
      });
    }
  }
  
  class ChemicalButton extends HTMLButtonElement {
    connectedCallback() {
      this.addEventListener("click", function (_e) {
        const forInput = document.getElementById(this.dataset.for);
  
        if (forInput) {
          forInput.dispatchEvent(
            new KeyboardEvent("keydown", {
              key: "Enter",
            })
          );
        }
      });
    }
  }
  
  class ChemicalIFrame extends HTMLIFrameElement {
    static observedAttributes = ["data-open"];
    connectedCallback() {
      const open = this.dataset.open;
      this.style.display = open === "true" ? "" : "none";
    }
    attributeChangedCallback(name, _oldValue, _newValue) {
      if (name === "data-open") {
        const open = this.dataset.open;
        this.style.display = open === "true" ? "" : "none";
  
        const controls = document.getElementById(this.dataset.controls);
  
        if (controls) {
          controls.dataset.open = open;
        }
      }
    }
  }
  
  class ChemicalControls extends HTMLElement {
    static observedAttributes = ["data-open"];
    connectedCallback() {
      const open = this.dataset.open;
      this.style.display = open === "true" ? "" : "none";
    }
    attributeChangedCallback(name, _oldValue, _newValue) {
      if (name === "data-open") {
        const open = this.dataset.open;
        this.style.display = open === "true" ? "" : "none";
      }
    }
  }
  
  class ChemicalLink extends HTMLAnchorElement {
    async connectedCallback() {
      const href = this.dataset.href;
      const service = this.dataset.service || "uv";
      const autoHttps = this.dataset.autoHttps  !== undefined;
      const searchEngine = this.dataset.searchEngine;
      this.dataset.chemicalLoading = "true";
  
      if (window.chemical.loaded) {
        this.setAttribute(
          "href",
          await chemical.encode(href, {
            service,
            autoHttps,
            searchEngine,
          })
        );
        this.dataset.chemicalLoading = "false";
      } else {
        window.addEventListener("chemicalLoaded", async () => {
          this.setAttribute(
            "href",
            await chemical.encode(href, {
              service,
              autoHttps,
              searchEngine,
            })
          );
          this.dataset.chemicalLoading = "false";
        });
      }
    }
  }
  
  class ChemicalSelect extends HTMLSelectElement {
    connectedCallback() {
      const store = this.dataset.defaultStore;
  
      this.addEventListener("change", function () {
        window.chemical.setStore(store, this.value);
      });
  
      if (store) {
        const value = window.chemical.getStore(store);
  
        const observerOptions = {
          childList: true,
          subtree: false,
        };
  
        const observer = new MutationObserver((records, _observer) => {
          for (const record of records) {
            for (const addedNode of record.addedNodes) {
              if (addedNode.tagName === "OPTION") {
                if (addedNode.getAttribute("value") === value) {
                  addedNode.setAttribute("selected", "");
                }
              }
            }
          }
        });
        observer.observe(this, observerOptions);
      }
    }
  }
  
  customElements.define("chemical-input", ChemicalInput, { extends: "input" });
  customElements.define("chemical-button", ChemicalButton, { extends: "button" });
  customElements.define("chemical-iframe", ChemicalIFrame, { extends: "iframe" });
  customElements.define("chemical-controls", ChemicalControls, {
    extends: "section",
  });
  customElements.define("chemical-link", ChemicalLink, { extends: "a" });
  customElements.define("chemical-select", ChemicalSelect, { extends: "select" });
  
  window.chemical.componentAction = (action, frameID) => {
    const frame = document.getElementById(frameID);
  
    if (frame) {
      switch (action) {
        case "back":
          frame.contentWindow.history.back();
          break;
        case "forward":
          frame.contentWindow.history.forward();
          break;
        case "reload":
          frame.contentWindow.location.reload();
          break;
        case "close":
          frame.dataset.open = "false";
          frame.src = "";
      }
    }
  };