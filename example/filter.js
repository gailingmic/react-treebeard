'use strict';

// Helper functions for filtering
export const defaultMatcher = (filterText, node) => {
  return node.name.toLowerCase().indexOf(filterText.toLowerCase()) !== -1;
};

export const findNode = (node, filter, matcher) => {
  return (
    matcher(filter, node) || // i match
    (node.children && // or i have decendents and one of them match
      node.children.length &&
      !!node.children.find(child => findNode(child, filter, matcher)))
  );
};

export const filterTree = (node, filter, matcher = defaultMatcher) => {
  if (node instanceof Array) {
    var result = [];
    node.forEach((element, id, array) => {
      // If im an exact match then all my children get to stay
      if (matcher(filter, element) || !element.children) {
        result.push(element);
        return;
      }

      // If not then only keep the ones that match or have matching descendants
      const filtered = element.children
        .filter(child => findNode(child, filter, matcher))
        .map(child => filterTree(child, filter, matcher));

      const filtObj = Object.assign({}, element, { children: filtered });
      result.push(filtObj);
    });

    return result;
  } else {
    // If im an exact match then all my children get to stay
    if (matcher(filter, node) || !node.children) {
      return node;
    }
    // If not then only keep the ones that match or have matching descendants
    const filtered = node.children
      .filter(child => findNode(child, filter, matcher))
      .map(child => filterTree(child, filter, matcher));
    return Object.assign({}, node, { children: filtered });
  }
};

export const expandFilteredNodes = (node, filter, matcher = defaultMatcher) => {
  if (node instanceof Array) {
    var result = [];
    node.forEach((element, id, array) => {
      let children = element.children;
      if (!children || children.length === 0) {
        result.push(Object.assign({}, element, { toggled: false }));
        return;
      }
      const childrenWithMatches = element.children.filter(child =>
        findNode(child, filter, matcher)
      );
      const shouldExpand = childrenWithMatches.length > 0;
      // If im going to expand, go through all the matches and see if thier children need to expand
      if (shouldExpand) {
        children = childrenWithMatches.map(child => {
          return expandFilteredNodes(child, filter, matcher);
        });
      }
      result.push(
        Object.assign({}, element, {
          children: children,
          toggled: shouldExpand
        })
      );
    });

    return result;
  } else {
    let children = node.children;
    if (!children || children.length === 0) {
      return Object.assign({}, node, { toggled: false });
    }
    const childrenWithMatches = node.children.filter(child =>
      findNode(child, filter, matcher)
    );
    const shouldExpand = childrenWithMatches.length > 0;
    // If im going to expand, go through all the matches and see if thier children need to expand
    if (shouldExpand) {
      children = childrenWithMatches.map(child => {
        return expandFilteredNodes(child, filter, matcher);
      });
    }
    return Object.assign({}, node, {
      children: children,
      toggled: shouldExpand
    });
  }
};
