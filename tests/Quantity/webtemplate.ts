export const rawTree =  {
      "id" : "systolic",
      "name" : "Systolic",
      "localizedName" : "Systolic",
      "rmType" : "DV_QUANTITY",
      "nodeId" : "at0004",
      "min" : 0,
      "max" : 1,
      "localizedNames" : {
        "en" : "Systolic"
      },
      "localizedDescriptions" : {
        "en" : "Peak systemic arterial blood pressure  - measured in systolic or contraction phase of the heart cycle."
      },
      "aqlPath" : "/content[openEHR-EHR-OBSERVATION.blood_pressure.v2]/data[at0001]/events[at0006]/data[at0003]/items[at0004]/value",
      "inputs" : [ {
        "suffix" : "magnitude",
        "type" : "DECIMAL",
        "validation" : {
          "range" : {
            "minOp" : ">=",
            "min" : 0.0,
            "maxOp" : "<",
            "max" : 1000.0
          },
          "precision" : {
            "minOp" : ">=",
            "min" : 0,
            "maxOp" : "<=",
            "max" : 0
          }
        }
      }, {
        "suffix" : "unit",
        "type" : "CODED_TEXT",
        "list" : [ {
          "value" : "mm[Hg]",
          "label" : "mm[Hg]",
          "localizedLabels" : {
            "en" : "mmHg"
          },
          "validation" : {
            "range" : {
              "minOp" : ">=",
              "min" : 0.0,
              "maxOp" : "<",
              "max" : 1000.0
            },
            "precision" : {
              "minOp" : ">=",
              "min" : 0,
              "maxOp" : "<=",
              "max" : 0
            }
          }
        } ]
      } ],
      "termBindings" : {
        "SNOMED-CT" : {
          "value" : "[SNOMED-CT(2003)::271649006]",
          "terminologyId" : "SNOMED-CT"
        }
      }
    }