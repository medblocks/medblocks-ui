# Documentation on creation of openEHR forms

##  Download achetypes needed for the form from Clinical Knowledge Manager (CKM)
Archetypes needed for you system can be scoped out from openEHR's Clinical Knowledge Manager website and downloaded. Download the Archetype files in ADL format and make sure to include at least one Root Archetype.

https://ckm.openehr.org/ckm/

![image](https://user-images.githubusercontent.com/57724250/139653489-9c599863-55bc-4557-a1ba-faf4face7506.png)

---

##  Create a new repository in Archetype Designer
Archetype Designer is a tool provided by Better to create templates and archetypes. If you cannot find a archetype specific to your needs, you can create one on Archetype Designer.

https://tools.openehr.org/designer/#/

![image](https://user-images.githubusercontent.com/57724250/139653721-5a6a0216-9bfe-434f-befd-263015b852eb.png)

---

##  Import all the archetypes downloaded to the repository
Open the newly created Repository, click the import button and select all the archetypes downloaded and click Upload All to upload the archetypes

![image](https://user-images.githubusercontent.com/57724250/139654956-0e8b7e5a-6640-486b-8f96-d73e82f0db53.png)

---

##  Create a new template
Select 'New' and 'Template' to create a new template. You will have to select an RM Type and a Root Archetype id and give an id for the template.

![image](https://user-images.githubusercontent.com/57724250/139655046-493c1d2e-381b-42ae-b4c0-08e65b4131eb.png)

![image](https://user-images.githubusercontent.com/57724250/139654515-ed77575d-c1d5-4127-a093-b314b1bf0234.png)

---

##  Add the imported achetypes as required to the template
After following the above steps a blank template will be created. Add your imported archetypes by pressing the "+"(add) button on "content". Customise your template according to the requirements, you can deselect attributes of archetypes that are unnecessary. 

![image](https://user-images.githubusercontent.com/57724250/139654739-23ba67c5-395f-4192-bb30-6c7f695aea9f.png)

---

##  Export the Template
After you are done editing your template, click export and select "Web Template" while exporting. This will export your template in a JSON format which will be used to create Clinical forms.
- (Export in template in OPT format also, you will need to post this file to openEHR server for posting compositions)

![image](https://user-images.githubusercontent.com/57724250/139655318-e92c280b-1fa8-44e1-8792-1b5b932f03da.png)

---

##  Install Medblocks UI VsCode Extension
Open VsCode and navigate to the extensions tab (Ctrl + Shift + X). Search for Medblocks-UI and install the Medblocks UI VsCode Extension.

https://marketplace.visualstudio.com/items?itemName=tornadoalert.medblocks-ui

![image](https://user-images.githubusercontent.com/57724250/139655882-f255ccaa-fdb9-4056-bde4-2e0e9b1ca36a.png)

---

##  Install Medblocks-UI npm package and import them in your app
Use the npm install command given below to install Medblocks-ui in your app

```
npm i medblocks-ui
```
Use the code snippet given below to import the packages in your app
```
import "medblocks-ui";
import "medblocks-ui/dist/shoelace";
```

---

##  Import template in your app
Create a folder with the name "templates" in base directory of your app and paste your exported template (JSON) in that folder

![image](https://user-images.githubusercontent.com/57724250/139657585-6657c3f4-6021-458c-b318-8aecbb19c94a.png)

---

## Use Medblocks Extension to generate JavaScript code for a Clinical form
Navigate to the Medblocks Extension Tab in VsCode, it will automatically detect the template and generate a JavaScipt code for a Clinical Form from your template.

![image](https://user-images.githubusercontent.com/57724250/139657944-83b0cfeb-669d-47d5-b8d8-0f1816fc1727.png)

---

## Copy the code from the extension and paste it in your app

Click the clipboard icon to copy all the code generated and paste it in your app

![image](https://user-images.githubusercontent.com/57724250/139658825-33206070-4670-4f7b-b607-99a13c29425a.png)

---

## Make it look better
The code generated will contain limited CSS, so use TailwindCSS, Bootstrap or Shoelace Style to make your form look better.

![image](https://user-images.githubusercontent.com/57724250/139659430-f3eb0fdf-773d-4c77-a9c7-9bf3418a3b92.png)

---

## Congo !! You are Done, now you can post start posting compositions to your openEHR server !!

*PS: Don't forget to post the template to the openEHR server before posting compositions*

---

### For a detailed and comprehensive Guide to develop an application using openEHR Standard [cick here](https://www.youtube.com/watch?v=kOU2HGqK23o&list=PLUr-PTsPYKV4Cl7gUe5sPoCQEfRJ3FpWW&ab_channel=SidharthRamesh)

