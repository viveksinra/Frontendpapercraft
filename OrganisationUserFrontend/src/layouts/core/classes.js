// Simple class name generator (no MUI dependency)
const createClass = (name) => name;

export const layoutClasses = {
  root: createClass('layout__root'),
  main: createClass('layout__main'),
  header: createClass('layout__header'),
  nav: {
    root: createClass('layout__nav__root'),
    mobile: createClass('layout__nav__mobile'),
    vertical: createClass('layout__nav__vertical'),
    horizontal: createClass('layout__nav__horizontal'),
  },
  content: createClass('layout__main__content'),
  sidebarContainer: createClass('layout__sidebar__container'),
};
