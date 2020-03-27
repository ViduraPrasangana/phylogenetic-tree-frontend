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
  overflow: "hidden",
  // overflowY: "scroll"
});

export const seats = [
  {
    seatNumber: "1A",
    row: 1,
    col: "A",
    booked: false
  },
  {
    seatNumber: "1B",
    row: 1,
    col: "B",
    booked: false
  },
  {
    seatNumber: "1C",
    row: 1,
    col: "C",
    booked: true
  },
  {
    seatNumber: "1D",
    row: 1,
    col: "D",
    booked: false
  },
  {
    seatNumber: "1E",
    row: 1,
    col: "E",
    booked: false
  },
  {
    seatNumber: "1F",
    row: 1,
    col: "F",
    booked: false
  },
  {
    seatNumber: "2A",
    row: 2,
    col: "A",
    booked: false
  },
  {
    seatNumber: "2B",
    row: 2,
    col: "B",
    booked: true
  },
  {
    seatNumber: "2C",
    row: 2,
    col: "C",
    booked: false
  },
  {
    seatNumber: "2D",
    row: 2,
    col: "D",
    booked: false
  },
  {
    seatNumber: "2E",
    row: 2,
    col: "E",
    booked: false
  },
  {
    seatNumber: "2F",
    row: 2,
    col: "F",
    booked: false
  }
];

export const remove = (array, item) => {
  var index = array.indexOf(item);
  if (index !== -1) array.splice(index, 1);
  return array;
};

export const getDestList = (allRoutes, selected) => {
  let destList = [];
  allRoutes.forEach(element => {
    if (element.origin_id === selected) destList.push(element);
  });
  return destList;
};
export function isInList(allRoutes, element) {
  let re = false;
  allRoutes.forEach(ele => {
    if (ele.origin_id === element.origin_id) {
      re = true;
    }
  });
  return re;
}
export const getFilteredOrigins = allRoutes => {
  let originList = [];
  allRoutes.forEach(element => {
    const isIn = isInList(originList, element);
    if (!isInList(originList, element)) originList.push(element);
  });
  return originList;
};

export const checkAuth = (err, callback) => {
  if (err.response.status === 401 && typeof callback === "function") {
    callback();
  }
};

export const getValueFromState = state => {
  switch (state) {
    case "on_time":
      return { name: "On Time", color: "success" };
      break;
    case "delay":
      return { name: "Delay", color: "warning" };
      break;
    case "cancelled":
      return { name: "Cancelled", color: "danger" };
      break;
  }
};