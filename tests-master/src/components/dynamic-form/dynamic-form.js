const tag = 'dynamic-form';
const html = require('./dynamic-form.html');
const css = require('./dynamic-form.scss');

customElements.define(tag, class extends EDSElement {
    static get observedAttributes() {
        return ['fields', 'isAdmin'];
    }

    init() {
        this.initShadowDOM(tag, html, css);
        this._refs = {
            formBodyContainer: this.$('.form-body-container'),
            submit: this.$('.submit'),
            inputElemetBox: this.$('.form-body-container input')
        };
        this.createForm();
        // this.sendData.bind(this)

    }

    initShadowDOM(tag, html, css) {
        super.initShadowDOM(tag, html, css);
    }

    createForm() {
        const fieldsData = JSON.parse(this.getAttribute("fields"));
        var getItemData = fieldsData.items;

        // Get The form array and make it unique
        var uniqueArray = [
            ...new Set(getItemData.map(obj => JSON.stringify(obj)))
        ].map(data => JSON.parse(data));

        //Get The Group data
        var getGroupData = fieldsData.groups;

        const isAdmin = JSON.parse(this.getAttribute("isAdmin"));

        //Genreate form 
        this.generateForm(uniqueArray, getGroupData);

        //convenience method
        this._refs.submit.addEventListener("click", () => {


            // var formData = new FormData(document.getElementById('frm-dynamic-form'))
            // let firstName = this.shadowRoot.querySelector('#textfield3');
            // let lastName
            // console.log(firstName.value);

            // We can create a funcation and get the data from element;
            var obj = {};
            var elements = this.shadowRoot.querySelectorAll('#frm-dynamic-form input');
            for (let i = 0; i < elements.length; ++i) {
                let element = elements[i];
                let name = element.name;
                let value = element.value;
                if (name) {
                    obj[name] = value;
                }
            }

            // check on console */
            console.log(obj);
            alert("Data submit sucessfully"+JSON.stringify(obj));

            //We can pass this data to server 

            (async () => {
                const rawResponse = await fetch('/', {
                  method: 'POST',
                  headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify(obj)
                });
                // const content = await rawResponse.json();              
                // console.log(content);
                
              })();
          
            this.shadowRoot.querySelector('#frm-dynamic-form').reset();




        });
    }

    getClass(elemCount) {
        switch (elemCount) {
            case 1:
                return "col-100";
            case 2:
                return "col-50";
            case 3:
                return "col-32";
            case 3:
                return "col-25";
            default:
                return "col-100";
        }
    }

    generateForm(arrayList, getGroupData) {

        //Sorting the array list
        var inputArray = arrayList.sort(function (a, b) {
            return a.id - b.id;
        });

        var rootForm = document.createElement("form");
        rootForm.setAttribute("id", "frm-dynamic-form");
        this._refs.formBodyContainer.appendChild(rootForm);

        for (let i = 0; i < getGroupData.length; i++) {
            var div = document.createElement("div");
            div.setAttribute("id", "div_" + i);
            div.setAttribute("class", "row");
            rootForm.appendChild(div);

            //Find css class based on no. of array element in single row
            var cssClass = this.getClass(getGroupData[i].length);

            if (Array.isArray(getGroupData[i])) {
                for (let j = 0; j < getGroupData[i].length; j++) {
                    var k = getGroupData[i][j];
                    this.GetDynamicElement(inputArray, k, div, cssClass);
                }
            } else {
                var k = getGroupData[i];
                this.GetDynamicElement(inputArray, k, div, cssClass);
            }

        }
    }
    GetDynamicElement(inputArray, k, div, cssClass) {
        for (let i = 0; i < inputArray.length; i++) {
            if (inputArray[i].id == k) {
                var childDiv = document.createElement("div");
                childDiv.setAttribute("id", "childDiv_" + i);
                childDiv.setAttribute("class", cssClass);
                div.appendChild(childDiv);

                // Push the control in child Div
                var label = document.createElement("label");
                var text = document.createTextNode(inputArray[i].fieldName);
                childDiv.appendChild(text);

                //Assign different attributes to the element.

                var element = document.createElement("input");
                element.setAttribute("id", inputArray[i].type.concat(inputArray[i].id));
                element.setAttribute("type", inputArray[i].type);
                element.setAttribute(
                    "name",
                    inputArray[i].fieldName.split(" ").join("")
                );
                element.setAttribute("size", inputArray[i].size);

                if (inputArray[i].height) {
                    element.setAttribute("height", inputArray[i].height);
                }

                //Append the element in page (in formcontainer).

                childDiv.appendChild(element);
                break;
            }
        }
    }


    sendData() {

        /*var formdata = this.getInputFormData();      
        var formdata = obj; */



        // event.preventDefault();
        // var request = new XMLHttpRequest(); 
        // request.open('POST', '/data/api', /* async = */ false);
        // var formData = new FormData(document.getElementById('frm-dynamic-form'));
        // request.send(formData);
        // document.getElementById('frm-dynamic-form').reset();
        // console.log(request.response);


    }

    // Write common method for get data if you pass direct object //

    getInputFormData() {
        var obj = {};
        var elements = shadow.querySelectorAll('#frm-dynamic-form input');
        for (let i = 0; i < elements.length; ++i) {
            let element = elements[i];
            let name = element.name;
            let value = element.value;
            if (name) {
                obj[name] = value;
            }

        }
    }



    destroy() {
        //clean up here
    }
});
