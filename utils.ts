import transform from "./src/extension/transform";
import { Data } from "./src/medblocks/form/utils";
import type {Tree,ProcessedTree,TransformFunction} from "./src/extension/transform"
const count = (composition:Data, path:string,initialCount=1):number => {
    if (!composition) return initialCount;
    let pattern = new RegExp(`${path}:(\\d)+`, "g");
    let arrayOfPaths = Object.keys(composition).filter((key) => key.match(pattern));
   
    if(arrayOfPaths.length>0){
      let fieldCount = pattern.exec(arrayOfPaths[arrayOfPaths.length - 1]) as RegExpExecArray;
      return parseInt(fieldCount[1])+1;
    }else{
      return initialCount
    }
  };
export {
    count ,
    transform,
    Tree,
    ProcessedTree,
    TransformFunction
}