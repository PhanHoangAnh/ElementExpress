var newId = 0;

// Sortable function
$(function () {
    var createAttributePad = document.querySelector('createAttributePad');
    var sortableDiv = createAttributePad.querySelector('[component-role = "receivedPad"]');
    $(sortableDiv).sortable({
        // connectWith: ".connectedSortable",
        sort: function (e) {
            $('[data-toggle=popover]').each(function () {
                // hide any open popovers when the anywhere else in the body is clicked                
                $(this).popover('hide');
            });
        },
        placeholder: "ui-sortable-placeholder",
        receive: function (e, ui) {
            ui.sender.sortable("cancel");
        },
        over: function (e, ui) {
            sortableIn = 1;
        },
        out: function (e, ui) {
            sortableIn = 0;
        },
        beforeStop: function (e, ui) {
            if (sortableIn == 0) {
                //ui.item.remove();
                $(ui.item.context).popover('destroy');
                $('[data-toggle=popover]').each(function () {
                    // hide any open popovers when the anywhere else in the body is clicked                        
                    $(this).popover('hide');
                });
                ui.item.remove();
            }
        }
    });

    $(".connectedSortable").sortable({
        connectWith: $(sortableDiv),
        remove: function (e, ui) {
            // 
            var nodeCopy = ui.item.clone();
            newId++;
            nodeCopy[0].id = newId; /* We cannot use the same ID */
            nodeCopy.attr("data-toggle", "popover");
            nodeCopy.attr("data-placement", "right");
            // chipl initiated popover before first click
            // 1. Create template for associated popover
            // Exception for combobox
            if (nodeCopy[0].getElementsByTagName("datalist").length != 0) {
                console.log(nodeCopy[0].getElementsByTagName("datalist").length);
                nodeCopy[0].getElementsByTagName("datalist")[0].id = newId + "list";
                var input = nodeCopy[0].getElementsByTagName("input")[0];
                input.setAttribute("list", newId + "list");
            }
            //
            nodeCopy.controlType = nodeCopy.attr("data-controlType");
            nodeCopy.attribute = {};
            var controldatas = getAttDatas();
            for (var i in controldatas) {
                if (controldatas[i]["Input Type"] == nodeCopy.controlType) {
                    for (var att in controldatas[i]["fields"]) {
                        nodeCopy.attribute[att] = controldatas[i]["fields"][att];
                    }
                }
            }
            nodeCopy.setted = false;
            var popoverContent = createAttributePanel(nodeCopy);
            // 2. Create popover
            $(nodeCopy).popover({
                html: true,
                trigger: 'click',
                title: nodeCopy.controlType,
                content: function () {
                    $('[data-toggle=popover]').each(function () {
                        // hide any open popovers when the anywhere else in the body is clicked                            
                        if (this != nodeCopy.get(0)) {
                            $(this).popover('hide');
                        }
                    });
                    return popoverContent;
                }
            });
            //nodeCopy.preventDefault;
            nodeCopy.appendTo(sortableDiv);
            $(this).sortable('cancel');
        },
        receive: function (e, ui) {
            ui.sender.sortable("cancel");
        },
        placeholder: "ui-sortable-placeholder",
        out: function (event, ui) {
            $('.placeholder').show();
        }
    });
})
// Create controls from JSON definition
$(function CreateControlsTemplate() {
    // body...
    var controldatas = getAttDatas();
    for (i in controldatas) {
        createSingleControlGroup(controldatas[i]);
    }
    setAttributeName();
})

function createSingleControlGroup(template) {
    newId++;
    // --------------------------//
    var createAttributePad = document.querySelector('createAttributePad');
    // var sortableDiv = document.querySelector("#div2");
    var receivedPad = createAttributePad.querySelector('[component-role = "receivedPad"]');
    var container_div = createAttributePad.querySelector('[component-role="containerControl"]').content;

    var majorDiv = container_div.querySelector('[component-role="container_div"]');
    majorDiv.id = newId
    receivedPad.appendChild(document.importNode(container_div, true));
    container_div = document.getElementById(newId);
    container_div.querySelector('[data-controltype="label"]').innerHTML = template["label"];
    var input_cover = container_div.querySelector('[component-role = "inpuCover"]');
    var input = document.createElement("input");
    input.classList.add("col-md-12");
    input.classList.add("col-lg-12");
    input.classList.add("form-control");

    switch (template["Input Type"]) {
        case ("text"):
            input.type = "text";
            if (template["placeholder"]) {
                input.placeholder = template["placeholder"];
            }
            input.setAttribute("data-controlType", "text");
            input_cover.appendChild(input);
            container_div.setAttribute("data-controlType", "text");
            break;
        case ("combobox"):
            input.type = "combobox";
            if (template["placeholder"]) {
                input.placeholder = template["placeholder"];
            }
            input.setAttribute("data-controlType", "combobox");
            input_cover.appendChild(input);
            container_div.setAttribute("data-controlType", "combobox");
            // in case for editable combobox, create datalist for this input
            if (template["fields"]["options"]) {
                var datalistId = newId + "datalist";
                input.setAttribute("list", datalistId);
                var datalist = document.createElement("datalist")
                datalist.id = datalistId;
                for (item in template["fields"]["options"]) {
                    var option = document.createElement("option");
                    option.setAttribute("value", template["fields"]["options"][item]);
                    datalist.appendChild(option);
                }
                input_cover.appendChild(datalist);
            }
            break;
        case ("select"):
            input = document.createElement("select");
            input.classList.add("col-md-12");
            input.classList.add("col-lg-12");
            input.classList.add("form-control");
            if (template["fields"]["options"]) {
                for (item in template["fields"]["options"]) {
                    var option = document.createElement("option");
                    option.setAttribute("value", item);
                    option.innerHTML = template["fields"]["options"][item];
                    input.appendChild(option);
                }
            }
            input_cover.appendChild(input);
            input.setAttribute("data-controlType", "select");
            container_div.setAttribute("data-controlType", "select");
            break;
        case ("textarea"):
            input = document.createElement("textarea");
            input.classList.add("col-md-12");
            input.classList.add("col-lg-12");
            input.classList.add("form-control");
            input.type = "textarea";
            input.setAttribute("data-controlType", "textarea");
            input_cover.appendChild(input);
            container_div.setAttribute("data-controlType", "textarea");
            break;
        case ("radio"):
            input = document.createElement("input");
            input.type = "radio";
            input.name = template["value"];
            if (template["fields"]["options"]) {
                for (item in template["fields"]["options"]) {
                    input.classList.add("c-left");
                    //input.classList.add("col-lg-6");
                    input.value = item;
                    var copy_radio = input.cloneNode(true);
                    input_cover.appendChild(copy_radio);
                    var span = document.createElement("span")
                    span.innerHTML = template["fields"]["options"][item];
                    span.classList.add("col-md-11");
                    span.classList.add("col-lg-11");
                    input_cover.appendChild(span);
                }
                input_cover.setAttribute("data-controlType", "options");
            }
            container_div.setAttribute("data-controlType", "radio");
            break;
        case ("checkbox"):
            input = document.createElement("input");
            input.type = "checkbox";
            input.name = template["value"];
            if (template["fields"]["options"]) {
                for (item in template["fields"]["options"]) {
                    input.classList.add("c-left");
                    //input.classList.add("col-lg-6");
                    input.value = item;
                    var copy_radio = input.cloneNode(true);
                    input_cover.appendChild(copy_radio);
                    var span = document.createElement("span")
                    span.innerHTML = template["fields"]["options"][item];
                    span.classList.add("col-md-11");
                    span.classList.add("col-lg-11");
                    input_cover.appendChild(span);
                }
                input_cover.setAttribute("data-controlType", "options");
                container_div.setAttribute("data-controlType", "checkbox");
            }
            break;
        case ("ImageOptions"):
            // Update for configurable attributes
            newId++;
            var input = document.importNode(document.getElementById('extraOptionImgHandler').content, true);
            input_cover.appendChild(input);
            input.id = newId;
            container_div.setAttribute("data-controlType", "ImageOptions"); //

            break;
        case ("number"):
            input.setAttribute("data-controlType", "number");
            input.type = "number";
            if (template["fields"]["min"]) {
                input.min = template["fields"]["min"];
            }
            if (template["fields"]["max"]) {
                input.max = template["fields"]["max"];
            }
            if (template["placeholder"]) {
                input.placeholder = template["placeholder"];
            }
            input_cover.insertBefore(input, container_div.querySelector('[data-controltype="describe"]'));
            container_div.setAttribute("data-controlType", "number");
            break;
        case ("date"):
            input.type = "date";
            if (template["placeholder"]) {
                input.placeholder = template["placeholder"];
                input.setAttribute("data-controlType", "input");
            }
            input_cover.insertBefore(input, container_div.querySelector('[data-controltype="describe"]'));
            container_div.setAttribute("data-controlType", "date");
            break;
        case ("color"):
            input.type = "color";
            if (template["placeholder"]) {
                input.placeholder = template["placeholder"];
                input.setAttribute("data-controlType", "input");
            }
            input_cover.insertBefore(input, container_div.querySelector('[data-controltype="describe"]'));
            container_div.setAttribute("data-controlType", "color");
            break;
        case ("range"):
            input.type = "range";
            if (template["fields"]["min"]) {
                input.min = template["fields"]["min"];
            }
            if (template["fields"]["max"]) {
                input.max = template["fields"]["max"];
            }
            if (template["placeholder"]) {
                input.placeholder = template["placeholder"];
            }
            container_div.setAttribute("data-controlType", "range");
            input_cover.insertBefore(input, container_div.querySelector('[data-controltype="describe"]'));
            break;
        case ("month"):
            input.type = "month";
            input_cover.insertBefore(input, container_div.querySelector('[data-controltype="describe"]'));
            container_div.setAttribute("data-controlType", "month");
            break;
        case ("week"):
            input.type = "week";
            input_cover.insertBefore(input, container_div.querySelector('[data-controltype="describe"]'));
            container_div.setAttribute("data-controlType", "week");
            break;
        case ("time"):
            input.type = "time";
            input_cover.insertBefore(input, container_div.querySelector('[data-controltype="describe"]'));
            container_div.setAttribute("data-controlType", "time");
            break;
        case ("image"):
            input = document.createElement('div');
            input.style.backgroundImage = "url('https://rawgit.com/PhanHoangAnh/CreateDynamicAttributeSets/master/materials/sample.jpg')";
            input.style.backgroundSize = 'cover';
            input.style.backgroundRepeat = 'no-repeat';
            input.style.outlineColor = 'rgba(255,255,255,.2)';
            input.style.outlineStyle = 'solid';
            input.style.outlineWidth = '3px';
            var mask = document.createElement('div');
            var height = template["fields"]['height']['value'];
            var width = template["fields"]['width']['value'];
            var paddingTop = height / width * 100;
            if (isNaN(paddingTop)) {
                mask.style = "position: relative; z-index: 5; padding-top: 56.25%;"
            } else {
                mask.style = "position: relative; z-index: 5;"
                mask.style.paddingTop = paddingTop + '%';
            };
            mask.setAttribute("app-role", "mask");
            input.appendChild(mask);
            input_cover.appendChild(input);
            container_div.setAttribute("data-controlType", "image");
            break;

    }

    if (template["fields"]["describe"]) {
        var span = container_div.querySelector('[data-controltype="describe"]')
        span.innerHTML = template["fields"]["describe"]["value"];
        span.classList.add("help-block");
    }
    input_cover.appendChild(span);
    container_div.appendChild(input_cover);
    //Test
    var container = template["container"];
    // console.log("templateData:", template);
    if (template["container"]) {
        document.getElementById(container).appendChild(container_div);
    } else {
        $(container_div).attr("data-toggle", "popover");
        $(container_div).attr("data-placement", "right");
        container_div.attribute = template["fields"];
        container_div.controlType = template["Input Type"];

        container_div["CUST"] = template["CUST"];
        var popoverContent = createAttributePanel(container_div);
        // 2. add CUST properties for container_div
        // 2. Create popover
        $(container_div).popover({
            html: true,
            trigger: 'click',
            title: container_div.controlType,
            content: function () {
                $('[data-toggle=popover]').each(function () {
                    // hide any open popovers when the anywhere else in the body is clicked                            
                    if (this != $(container_div).get(0)) {
                        $(this).popover('hide');
                    }
                });
                // set custom attribute for popover content here                
                return popoverContent;
            }
        });
    }
}

function createAttributePanel(nodeCopy, title) {

    var controlType = nodeCopy.controlType;
    var fields = nodeCopy.attribute;
    var main_panel = document.createElement('main_panel');
    main_panel.classList.add("col-md-12", "col-lg-12", "clearfix");
    for (var item in fields) {
        var label = document.createElement("LABEL");
        label.classList.add("col-lg-12", "col-md-12");
        main_panel.appendChild(label);
        if (item != "options" && item != "min" && item != "max" && item != "ImageOptions") {
            label.innerHTML = fields[item]["label"];
            var input = document.createElement("input");
            input.classList.add("col-md-12", "col-lg-12");
            input.type = fields[item]["Input Type"];
            input.placeholder = fields[item]["value"];

            input.setAttribute("data-controlType", item);
            input.addEventListener("change", changeControlAttribute, false);

            if (item == "required") {
                var row = document.createElement("div");
                // row.classList.add("row");
                row.classList.add("clearfix");
                row.style.float = "left";
                row.style.width = "100%";
                row.style["padding-top"] = "7px";
                label.classList.remove("col-lg-12");
                label.classList.remove("col-md-12");
                label.classList.add("col-lg-6");
                label.classList.add("col-md-6");
                label.innerHTML = "Require";
                input.classList.remove("col-lg-12");
                input.classList.remove("col-md-12");
                input.classList.add("col-md-6");
                input.classList.add("col-lg-6");
                input.type = fields[item]["Input Type"];
                input.addEventListener("change", changeControlAttribute, false);
                row.appendChild(label);
                row.appendChild(input);
                main_panel.appendChild(row);
            } else {
                main_panel.appendChild(input);
            }
        }
        if (item == "options") {
            // if (nodeCopy.controlType == "radio"){};
            var input = document.createElement('textarea');
            input.rows = 3;
            input.classList.add("col-md-12");
            input.classList.add("col-lg-12");
            label.innerHTML = "Options";
            var opt_string = "";
            for (var opt in fields["options"]) {
                opt_string = opt_string + fields["options"][opt] + "\n";
            }
            input.value = opt_string;
            input.setAttribute("data-controlType", item)
            input.addEventListener("change", changeControlAttribute, false);
            main_panel.appendChild(input);
        }
        if (item == "min" || item == "max") {
            label.innerHTML = item;
            var input = document.createElement("input");
            input.classList.add("col-md-12");
            input.classList.add("col-lg-12");
            input.type = "number";
            input.placeholder = "Number only";
            input.setAttribute("data-controlType", item);
            input.addEventListener("change", changeControlAttribute, false);
            main_panel.appendChild(input);
        }
        if (item == "ImageOptions") {
            // Update for configurable attributes           
            label.innerHTML = item;
            var input_cover = document.createElement("div");
            input_cover.setAttribute("app-role", "imgOptionHandler");
            if (nodeCopy instanceof Element) {
                nodeCopy = $(nodeCopy);
            }
            input_cover.referParentElem = nodeCopy.get(0);

            input_cover.classList.add("col-md-12");
            input_cover.style.padding = '0';
            var input = document.importNode(document.getElementById('extraOptionImgHandler').content, true);
            input_cover.appendChild(input);
            main_panel.appendChild(input_cover);
            var dropPad = input_cover.querySelector('[app-role="droppad"]');

            //http: //stackoverflow.com/questions/750486/javascript-closure-inside-loops-simple-practical-example

            if (!nodeCopy.get(0).CUST) {
                nodeCopy.get(0).CUST = {};
            }
            // var CUST = nodeCopy.get(0).CUST;
            if (!nodeCopy.get(0).CUST['ImageOptions']) {
                nodeCopy.get(0).CUST['ImageOptions'] = fields['ImageOptions'];
            }

            var imgDataOptions = nodeCopy.get(0).CUST['ImageOptions'];
            for (var opt in imgDataOptions) {
                //console.log(" Test: ", fields["ImageOptions"][opt]);
                var item = document.getElementById('extraOptionImgItem').content;
                var label = item.querySelector('[app-role="attName"]');
                label.innerHTML = imgDataOptions[opt]['optName'];
                var img = item.querySelector('[app-role = "attImg"]');
                var imgSrc = imgDataOptions[opt].img
                // update check valid URL later here                    
                if (imgSrc.indexOf("http") == -1) {
                    imgSrc = window.location.protocol + "//" + window.location.hostname + ":" + window.location.port + "/" + imgSrc
                }
                img.setAttribute('src', imgSrc);
                var temp = document.importNode(item, true);
                temp.querySelector('[app-role="selectItem"]').setAttribute('app-value', imgDataOptions[opt].value);
                var currentNode = dropPad.appendChild(temp);
                // dropPad.lastElementChild.setAttribute('app-value', imgDataOptions[opt].value);
            }
        }
    }
    var hr = document.createElement("hr");
    hr.setAttribute("style", "width: 100%;display: block;float: left;");
    main_panel.appendChild(hr);
    var closeBnt = document.createElement("button");
    closeBnt.classList.add("btn");
    closeBnt.classList.add("btn-primary");
    closeBnt.innerHTML = "Close";
    closeBnt.addEventListener("click", function (evt) {
        $('[data-toggle=popover]').each(function () {
            $(this).popover('hide');
        });
        // saveElement();
    }, false);

    var controlHandler = document.createElement("div");
    controlHandler.style["text-align"] = "center";
    controlHandler.style["padding-bottom"] = "15px";
    controlHandler.style["clear"] = "both";
    controlHandler.appendChild(closeBnt);

    var cover = document.createElement("cover");
    cover.classList.add("row");
    cover.style.float = "left";
    cover.style.padding = "15px";
    main_panel.appendChild(controlHandler);
    cover.appendChild(main_panel);

    function changeControlAttribute(evt) {
        var ctrType = this.getAttribute("data-controlType");
        var controls;
        var htmlNodeCopy;
        if (nodeCopy instanceof Node) {
            controls = $(nodeCopy).get(0).querySelectorAll("[data-controlType]");
            htmlNodeCopy = nodeCopy;
        } else {
            controls = nodeCopy.get(0).querySelectorAll("[data-controlType]");
            htmlNodeCopy = nodeCopy.get(0);
        }
        if (!htmlNodeCopy["CUST"]) {
            htmlNodeCopy["CUST"] = {};
        }
        for (var elem in controls) {

            htmlNodeCopy["CUST"][ctrType] = this.value;
            if (controls[elem] instanceof Node && ctrType == "placeholder" && (controls[elem].type == "text" || controls[elem].type == "number")) {
                controls[elem].placeholder = this.value;
            }
            // exception for width and height fields
            if (ctrType == "width" || ctrType == "height") {
                var paddingTop = htmlNodeCopy["CUST"]['height'] / htmlNodeCopy["CUST"]['width'] * 100;
                if (isNaN(paddingTop)) {
                    htmlNodeCopy["CUST"]['width'] = 10;
                    htmlNodeCopy["CUST"]['height'] = 10;
                }
                var mask = htmlNodeCopy.querySelector('[app-role="mask"]');
                mask.style.paddingTop = paddingTop + '%';
            }
            if (controls[elem] instanceof Node && ctrType == "options" && (controls[elem].type == "select-one")) {
                var select = controls[elem];
                var optArr = $(this).val().split('\n');
                optArr = optArr.filter(function (n) {
                    return n != "";
                });
                while (select.firstChild) {
                    select.removeChild(select.firstChild);
                }
                for (var item in optArr) {
                    var option = document.createElement("option");
                    option.setAttribute("value", item);
                    option.innerHTML = optArr[item];
                    select.appendChild(option);
                }
            }

            if (controls[elem] instanceof Node && ctrType == "options" && (controls[elem].type == "text")) {
                var optArr = $(this).val().split('\n');
                optArr = optArr.filter(function (n) {
                    return n != "";
                });
                // Select and update datalist                
                var datalistId = controls[elem].getAttribute("list");
                var datalist = document.getElementById(datalistId);
                while (datalist.firstChild) {
                    datalist.removeChild(datalist.firstChild);
                }

                for (var item in optArr) {
                    var option = document.createElement("option");
                    option.setAttribute("value", optArr[item])
                    datalist.appendChild(option);
                }
            }
            if (controls[elem] instanceof Node && controls[elem].getAttribute("data-controltype") == ctrType) {
                if (ctrType == "options") {
                    // follow http://stackoverflow.com/questions/281264/remove-empty-elements-from-an-array-in-javascript
                    var optArr = $(this).val().split('\n');
                    optArr = optArr.filter(function (n) {
                        return n != "";
                    });
                    //console.log(optArr);
                    var describe = controls[elem].querySelector("[data-controlType='describe']").cloneNode(true);
                    while (controls[elem].firstChild) {
                        controls[elem].removeChild(controls[elem].firstChild);
                    }
                    var inputType = controls[elem].parentNode.getAttribute("data-controlType");
                    var input = document.createElement("input");
                    input.type = inputType;
                    for (var item in optArr) {
                        // Set input name later
                        input.classList.add("col-md-6");
                        input.classList.add("col-lg-6");
                        input.value = item;
                        var copy_radio = input.cloneNode(true);
                        controls[elem].appendChild(copy_radio);
                        var span = document.createElement("span")
                        span.innerHTML = optArr[item];
                        span.classList.add("col-md-6");
                        span.classList.add("col-lg-6");
                        controls[elem].appendChild(span);
                    }
                    controls[elem].appendChild(describe);
                } else {
                    controls[elem].innerHTML = this.value;
                    if (title) {
                        compObj.AttributeSetsName = this.value;
                    }
                }
            }
        }
    }
    return cover;
}

function setAttributeName() {
    var legent = document.querySelector("#SetsName");
    // var legent = $(_legent);
    legent.setAttribute("data-toggle", "popover");
    legent.setAttribute("data-placement", "right");
    legent.attribute = {};
    legent.attribute["label"] = {
        "label": "Set Attributes Set Name",
        "Input Type": "text",
        "value": "Text Input"
    }

    legent.setted = false;
    var _Content = createAttributePanel(legent, true);
    // 2. Create popover
    $(legent).popover({
        html: true,
        // trigger: 'click',
        title: "Set Attributes Name",
        content: function () {
            $('[data-toggle=popover]').each(function () {
                if (this != legent) {
                    $(this).popover('hide');
                }
            });
            return _Content;
        }
    });
}

var compObj = {}

function saveElement() {
    // update entire sortable
    var createAttributePad = document.querySelector('createAttributePad');
    var sortableDiv = createAttributePad.querySelector('[component-role = "receivedPad"]');
    var elementLists = sortableDiv.querySelectorAll("[id]");
    var printedList = [];
    for (var elem in elementLists) {
        if (elementLists[elem]["CUST"]) {
            var jsonObj = {}
            jsonObj["data-controlType"] = elementLists[elem].getAttribute("data-controlType");
            jsonObj["attributes"] = elementLists[elem]["CUST"];
            printedList.push(jsonObj);
        }
    }
    compObj.components = printedList
    document.getElementById("printJSON").innerHTML = JSON.stringify(compObj, undefined, 2);
}

function loadOptionSets(optSet) {
    //1. Load option Sets Name
    // var setsName = document.getElementById("SetsName").querySelector('[data-controltype="label"]');
    // compObj.setName = setsName.innerHTML = optSet.setName;
    // compObj.objId = optSet._id;
    //2. Rendering component and its attributes
    // clear div2 before add new element

    var createAttributePad = document.querySelector('createAttributePad');
    // var sortableDiv = document.querySelector("#div2");    
    var airField = createAttributePad.querySelector('[component-role = "receivedPad"]');

    while (airField.firstChild) {
        airField.removeChild(airField.firstChild);
    }
    //
    var _data = getAttDatas();
    for (var i in optSet.components) {
        var mockObj = {};
        for (var k in _data) {
            if (optSet.components[i] && _data[k]["Input Type"] == optSet.components[i]["data-controlType"]) {
                mockObj.fields = _data[k]["fields"];
                break;
            }
        }
        for (var k in mockObj.fields) {
            var compareItem = optSet.components[i].attributes[k];
            if (!compareItem) {
                break;
            }
            // Must be updated here Chipl
            if (k == "options") {
                var optArr = compareItem.split('\n');
                optArr = optArr.filter(function (n) {
                    return n != "";
                });
                mockObj.fields[k] = optArr;
            } else if (k != "ImageOptions") {
                mockObj.fields[k].value = compareItem;
            }
        }
        // mockObj.fields =
        if (optSet.components[i]) {
            mockObj["Input Type"] = optSet.components[i]["data-controlType"];
            mockObj["label"] = optSet.components[i]["attributes"]["label"];
            // copy object to avoid the refer
            var CUST = Object.assign({}, optSet["components"][i]["attributes"])
            mockObj["CUST"] = CUST;
            createSingleControlGroup(mockObj, true);
        }

    }
}


function setAttribIcon(elem) {
    // console.log("here: ", elem.src);
    compObj.img = elem.src;
}
// image option region
var htmlJSON = {
    "components": [{
            "data-controlType": "text",
            "attributes": {
                "id": "con vit",
                "label": "con vit",
                "placeholder": "something",
                "describe": "someproblem",
                "required": "on"
            }
        },
        {
            "data-controlType": "textarea",
            "attributes": {
                "id": "meo",
                "label": "cho",
                "describe": "cun"
            }
        },
        {
            "data-controlType": "combobox",
            "attributes": {
                "id": "con vit",
                "label": "con meo",
                "options": "value 1\nvalue 2\nvalue 3\nvalue 4",
                "placeholder": "meo",
                "describe": "something",
                "required": "on"
            }
        },
        {
            "data-controlType": "checkbox",
            "attributes": {
                "id": "abcd",
                "label": "defg",
                "describe": "conit",
                "options": "value 1\nvalue 2\nvalue 3\nvalue 5"
            }
        }
    ]
}

//loadOptionSets(htmlJSON);
document.onreadystatechange = function () {
    console.log("document ready");
    loadOptionSets(htmlJSON);
};

// Testing loadOptionSets function



// End of test

var imageOption = {}

imageOption.toggleShow = function (elem, event) {
    if (elem) {
        elem.classList.toggle("active");
        var dropdown = elem.parentNode.querySelector('[app-role="dropdown"]');
        dropdown.classList.toggle("open");
    }
}

imageOption.hideShow = function (elem) {
    // console.log(elem);
    if (elem) {
        elem.classList.remove("active");
        var dropdown = elem.parentNode.querySelector('[app-role="dropdown"]');
        dropdown.classList.remove("open");
    }
}

imageOption.activeShow = function (elem, event) {
    if (elem) {
        elem.classList.add("active");
        var dropdown = elem.parentNode.querySelector('[app-role="dropdown"]');
        dropdown.classList.add("open");
    }
}

imageOption.itemFocuses = function (elem) {
    // console.log("Item focus: ", elem);
}

imageOption.getOptionImage = function (evt) {
    var selectHandler = imageOption.getHandler(evt, "selectHandler");
    // evt.stopPropagation();
    // imgOptionHandler = imageOption.getHandler(evt, "imgOptionHandler").referParentElem

    // console.log("imgOptionHandler parent: ", imgOptionHandler)
    var selectbox = selectHandler.querySelector('[app-role="selectbox"]');
    imageOption.toggleShow(selectbox);
    // remove all childs
    while (selectbox.firstChild) {
        selectbox.removeChild(selectbox.firstChild);
    }
    // clone this node
    var cln = evt.cloneNode(true);
    // remove action Listener
    cln.onclick = null;
    selectbox.appendChild(cln);
    var bntBox = cln.querySelector('.s-button');
    if (bntBox) {
        bntBox.parentNode.removeChild(bntBox);
    };
    // change the css indicate selectedItem.
    // remove current css of selected item
    var curr = selectHandler.querySelector('.curr');
    if (curr) {
        curr.classList.remove('curr');
    };
    // ad this css for new element
    evt.classList.add('curr');
}

imageOption.updateImageOption = function (data) {
    var selectItem = imageOption.getHandler(selectImageHandler.currentElement, "selectItem")
    var selectImage = selectItem.querySelector('[app-role="attImg"]');
    selectImage.setAttribute("src", data);
    imgOptionHandler = imageOption.getHandler(selectImageHandler.currentElement, "imgOptionHandler").referParentElem
    var itemValue = selectItem.getAttribute('app-value');
    var imageArrStore = imgOptionHandler.CUST.ImageOptions;
    for (var i = 0; i < imageArrStore.length; i++) {
        if (imageArrStore[i].value == itemValue) {
            imageArrStore[i].img = data
        }
    }
    imageOption.getOptionImage(selectItem);
    imageOption.hideShow(imageOption.getHandler(selectItem, "dropdown"));

}

// imageOption Utility

imageOption.getHandler = function (elem, att) {
    if (elem.parentNode.getAttribute('app-role') == att) {
        return elem.parentNode
    } else {
        return imageOption.getHandler(elem.parentNode, att);
    }
}

imageOption.deleteFn = function (elem) {
    event.stopPropagation();
    var selectItem = imageOption.getHandler(elem, "selectItem");
    var itemValue = selectItem.getAttribute('app-value');
    var imgOptionHandler = imageOption.getHandler(selectItem, "imgOptionHandler").referParentElem
    var imageArrStore = imgOptionHandler.CUST.ImageOptions;
    var selectHandler = imageOption.getHandler(elem, "selectHandler");
    var selectbox = selectHandler.querySelector('[app-role="selectbox"]');

    imgOptionHandler.CUST.ImageOptions = imageArrStore.filter(function (obj) {
        return obj.value.toString() !== itemValue;
    })
    imageOption.toggleShow(selectbox);
    // remove all childs
    while (selectbox.firstChild) {
        selectbox.removeChild(selectbox.firstChild);
    }
    selectbox.innerHTML = "Select here";
    selectItem.parentNode.removeChild(selectItem);
}

imageOption.addmoreFn = function (elem) {
    var input = document.importNode(document.getElementById('extraOptionImgItem').content, true);
    var dropPad = imageOption.getHandler(elem, 'selectHandler').querySelector('[app-role="droppad"]');
    var imgOptionHandler = imageOption.getHandler(dropPad, "imgOptionHandler").referParentElem
    var label = input.querySelector('[app-role="attName"]');
    label.innerHTML = "new Item";
    var imageArrStore = imgOptionHandler.CUST.ImageOptions;
    var max = Math.max.apply(Math, imageArrStore.map(function (o) {
        return o.value;
    }));
    var imgTempObj = {
        img: null,
        optName: null,
        value: max + 1
    }
    imageArrStore.push(imgTempObj);
    input.querySelector('[app-role="selectItem"]').setAttribute('app-value', max + 1);
    var editBnt = input.querySelector('[app-role="editImgOption"]')
    dropPad.appendChild(input);
    selectImageHandler.openImageUploadModal(editBnt);

}

imageOption.changeAttributeName = function (elem) {
    var controlHandler = imageOption.getHandler(selectImageHandler.currentElement, "selectItem")
    var imgOpt = controlHandler.querySelector('[app-role="attName"]');
    var itemValue = controlHandler.getAttribute('app-value');
    imgOpt.innerHTML = elem.value;

    var imgOptionHandler = imageOption.getHandler(imgOpt, "imgOptionHandler").referParentElem
    var imageArrStore = imgOptionHandler.CUST.ImageOptions;
    for (var i = 0; i < imageArrStore.length; i++) {
        if (imageArrStore[i].value == itemValue) {
            imageArrStore[i].optName = elem.value;
        }
    }
    imageOption.getOptionImage(controlHandler);
    imageOption.hideShow(imageOption.getHandler(controlHandler, "dropdown"));
}