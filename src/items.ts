import { writable } from 'svelte/store';

export interface Item {
  id: string;
  toDo: string;
}

const DEFAULT_ITEMS: Item[] = [] as Item[];

const items = writable<Item[]>(
  DEFAULT_ITEMS,
  (set) => {
    const persisted = localStorage.getItem(
      'items'
    );

    if (!persisted) {
      set(DEFAULT_ITEMS);
      return;
    }

    try {
      set(JSON.parse(persisted));
    } catch (e) {
      console.log(e);
      set(DEFAULT_ITEMS);
      alert(
        'Found items, but failed to load them!'
      );
    }
  }
);

items.subscribe((value) => {
  try {
    const serialized = JSON.stringify(
      value
    );
    localStorage.setItem(
      'items',
      serialized
    );
  } catch (e) {
    console.error(e);
    alert('Failed to save items!');
  }
});

export default items;
