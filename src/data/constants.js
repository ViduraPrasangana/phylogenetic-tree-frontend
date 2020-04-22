export const minTrans = {
  backgroundColor: "#ffffffdd"
};
export const halfTrans = {
  backgroundColor: "#ffffff45"
};
export const quarterTrans = {
  backgroundColor: "#ffffffa0"
};
export const innerStyle = {
  backgroundColor: "#ffffff00",
  borderColor: "#00000033"
};
export const fullTrans = {
  backgroundColor: "#ffffff00"
};

export const bgStyle = backgroundImage => ({
  backgroundImage: `url(${backgroundImage})`,
  backgroundPosition: "center",
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
  minHeight: "100%",
  backgroundAttachment: "fixed",
  height: "100%",
  
});
export const scrollHide = {
overflow: "hidden",
overflowY: "scroll"
}

export const remove = (array, item) => {
  var index = array.indexOf(item);
  if (index !== -1) array.splice(index, 1);
  return array;
};

export function addNamesToTree(data,count,index){
  if(data.children){
    data.name = count.toString()+"."+index.toString()
    data.children.forEach((element,index) => {
      element = addNamesToTree(element,count+1,index+1)
    });
    
  }
  console.log(data)
  return data
}
