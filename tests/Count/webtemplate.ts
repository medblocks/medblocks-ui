export const rawTree = {
    "id" : "total_score",
    "name" : "Total score",
    "localizedName" : "Total score",
    "rmType" : "DV_COUNT",
    "nodeId" : "at0026",
    "min" : 0,
    "max" : 1,
    "localizedNames" : {
      "en" : "Total score"
    },
    "localizedDescriptions" : {
      "en" : "The sum of the ordinal scores recorded for each of the three component responses."
    },
    "annotations" : {
      "comment" : "The Total Score may be derived as the sum of the three response data elements and, if so, should be validated by the clinical information system against the individual scores entered by the clinician to ensure there is no conflict or inconsistency. Do not report a total score when one or more components are not testable because the score will be artificially low - in this situation record the EVM profile."
    },
    "aqlPath" : "/content[openEHR-EHR-OBSERVATION.glasgow_coma_scale.v1]/data[at0001]/events[at0002]/data[at0003]/items[at0026]/value",
    "inputs" : [ {
      "type" : "INTEGER",
      "validation" : {
        "range" : {
          "minOp" : ">=",
          "min" : 3,
          "maxOp" : "<=",
          "max" : 15
        }
      }
    } ]
  }