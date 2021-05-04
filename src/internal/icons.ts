import { registerIconLibrary } from '@shoelace-style/shoelace/dist/utilities/icon-library';

export function registerIcons() {
  const icons = {
    search: `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
  </svg>
      `,
    'caret-down-full': `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-down-fill" viewBox="0 0 16 16">
      <path d="M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
    </svg>`,
  };

  const searchLibrary = {
    name: 'medblocks',
    resolver: (name: keyof typeof icons) => {
      if (icons[name]) {
        return `data:image/svg+xml,${encodeURIComponent(icons[name])}`;
      } else {
        return '';
      }
    },
  };

  registerIconLibrary('medblocks', searchLibrary);
}
