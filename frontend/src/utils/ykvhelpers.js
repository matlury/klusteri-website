export function activeColour({present, late}) {
    if (late) {
      return "rgb(250, 160, 160)"
    } else if (present) {
      return "rgb(169, 245, 98)"
    } else {
      return "transparent"
    };
  };