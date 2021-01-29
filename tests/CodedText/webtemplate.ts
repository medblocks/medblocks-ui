export const rawTree = {
  "id": "presence",
  "name": "Presence",
  "localizedName": "Presence",
  "rmType": "DV_CODED_TEXT",
  "nodeId": "at1005",
  "min": 0,
  "max": 1,
  "localizedNames": {
    "en": "Presence"
  },
  "localizedDescriptions": {
    "en": "Presence of a pulse or heart beat."
  },
  "annotations": {
    "comment": "It can be implied that the pulse or heart beat is present if Rate >0 /min."
  },
  "aqlPath": "/content[openEHR-EHR-OBSERVATION.pulse.v2]/data[at0002]/events[at0003]/data[at0001]/items[at1005]/value",
  "inputs": [{
    "suffix": "code",
    "type": "CODED_TEXT",
    "list": [{
      "value": "at1024",
      "label": "Present",
      "localizedLabels": {
        "en": "Present"
      },
      "localizedDescriptions": {
        "en": "A pulse or heart beat can be detected."
      }
    }, {
      "value": "at1025",
      "label": "Not detected",
      "localizedLabels": {
        "en": "Not detected"
      },
      "localizedDescriptions": {
        "en": "A pulse or heart beat cannot be detected."
      }
    }]
  }]
}

export const withDefault = {
  "id": "test_name",
  "name": "Test name",
  "localizedName": "Test name",
  "rmType": "DV_CODED_TEXT",
  "nodeId": "at0005",
  "min": 1,
  "max": 1,
  "localizedNames": {
    "en": "Test name"
  },
  "localizedDescriptions": {
    "en": "Name of the laboratory investigation performed on the specimen(s)."
  },
  "annotations": {
    "comment": "A test result may be for a single analyte, or a group of items, including panel tests. It is strongly recommended that 'Test name' be coded with a terminology, for example LOINC or SNOMED CT. For example: 'Glucose', 'Urea and Electrolytes', 'Swab', 'Cortisol (am)', 'Potassium in perspiration' or 'Melanoma histopathology'. The name may sometimes include specimen type and patient state, for example 'Fasting blood glucose' or include other information, as 'Potassium (PNA blood gas)'."
  },
  "aqlPath": "/content[openEHR-EHR-OBSERVATION.laboratory_test_result.v1,'Complete Blood Picture']/data[at0001]/events[at0002]/data[at0003]/items[at0005]/value",
  "inputs": [{
    "suffix": "code",
    "type": "TEXT",
    "defaultValue": "58410-2",
    "terminology": "LOINC"
  }, {
    "suffix": "value",
    "type": "TEXT",
    "defaultValue": "CBC panel - Blood by Automated count",
    "terminology": "LOINC"
  }]
}

export const expandableList = {
  "id" : "overall_test_status",
  "name" : "Overall test status",
  "localizedName" : "Overall test status",
  "rmType" : "DV_CODED_TEXT",
  "nodeId" : "at0073",
  "min" : 0,
  "max" : 1,
  "localizedNames" : {
    "en" : "Overall test status"
  },
  "localizedDescriptions" : {
    "en" : "The status of the laboratory test result as a whole."
  },
  "annotations" : {
    "comment" : "The values have been specifically chosen to match those in the HL7 FHIR Diagnostic report, historically derived from HL7v2 practice. Other local codes/terms can be used via the Text 'choice'.\r\n\r\nThis element is multiple occurrence to cater for the use cases where statuses for different aspects of the result have been split into several elements."
  },
  "aqlPath" : "/content[openEHR-EHR-OBSERVATION.laboratory_test_result.v1,'Complete Blood Picture']/data[at0001]/events[at0002]/data[at0003]/items[at0073]/value",
  "inputs" : [ {
    "suffix" : "code",
    "type" : "CODED_TEXT",
    "list" : [ {
      "value" : "at0107",
      "label" : "Registered",
      "localizedLabels" : {
        "en" : "Registered"
      },
      "localizedDescriptions" : {
        "en" : "The existence of the test is registered in the Laboratory Information System, but there is nothing yet available."
      }
    }, {
      "value" : "at0037",
      "label" : "Partial",
      "localizedLabels" : {
        "en" : "Partial"
      },
      "localizedDescriptions" : {
        "en" : "This is a partial (e.g. initial, interim or preliminary) Test Result: data in the Test Result may be incomplete or unverified."
      }
    }, {
      "value" : "at0120",
      "label" : "Preliminary",
      "localizedLabels" : {
        "en" : "Preliminary"
      },
      "localizedDescriptions" : {
        "en" : "Verified early results are available, but not all results are final. This is a sub-category of 'Partial'."
      }
    }, {
      "value" : "at0038",
      "label" : "Final",
      "localizedLabels" : {
        "en" : "Final"
      },
      "localizedDescriptions" : {
        "en" : "The Test result is complete and verified by an authorised person."
      }
    }, {
      "value" : "at0040",
      "label" : "Amended",
      "localizedLabels" : {
        "en" : "Amended"
      },
      "localizedDescriptions" : {
        "en" : "The result has been modified subsequent to being Final, and is complete and verified by the responsible pathologist, and result data has been changed."
      }
    }, {
      "value" : "at0115",
      "label" : "Corrected",
      "localizedLabels" : {
        "en" : "Corrected"
      },
      "localizedDescriptions" : {
        "en" : "The result has been modified subsequent to being Final, and is complete and verified by the responsible pathologist. This is a sub-category of 'Amended'."
      }
    }, {
      "value" : "at0119",
      "label" : "Appended",
      "localizedLabels" : {
        "en" : "Appended"
      },
      "localizedDescriptions" : {
        "en" : "Subsequent to being final, the report has been modified by adding new content. The existing content is unchanged. This is a sub-category of 'Amended'."
      }
    }, {
      "value" : "at0074",
      "label" : "Cancelled",
      "localizedLabels" : {
        "en" : "Cancelled"
      },
      "localizedDescriptions" : {
        "en" : "The result is unavailable because the test was not started or not completed (also sometimes called 'aborted')."
      }
    }, {
      "value" : "at0116",
      "label" : "Entered in error",
      "localizedLabels" : {
        "en" : "Entered in error"
      },
      "localizedDescriptions" : {
        "en" : "The Test Result has been withdrawn following previous Final release."
      }
    } ],
    "listOpen" : true
  }, {
    "suffix" : "other",
    "type" : "TEXT"
  } ]
}

export const searchComponent = {
  "id" : "problem_diagnosis_name",
  "name" : "Problem/Diagnosis name",
  "localizedName" : "Problem/Diagnosis name",
  "rmType" : "DV_CODED_TEXT",
  "nodeId" : "at0002",
  "min" : 1,
  "max" : 1,
  "localizedNames" : {
    "en" : "Problem/Diagnosis name"
  },
  "localizedDescriptions" : {
    "en" : "Identification of the problem or diagnosis, by name."
  },
  "annotations" : {
    "comment" : "Coding of the name of the problem or diagnosis with a terminology is preferred, where possible."
  },
  "aqlPath" : "/content[openEHR-EHR-EVALUATION.problem_diagnosis.v1]/data[at0001]/items[at0002]/value",
  "inputs" : [ {
    "suffix" : "code",
    "type" : "TEXT",
    "terminology" : "snomed"
  }, {
    "suffix" : "value",
    "type" : "TEXT",
    "terminology" : "snomed"
  } ]
}