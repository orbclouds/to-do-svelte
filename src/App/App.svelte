<script lang="ts" context="module">
  import type { Item } from '@app/items';

  const generateID = () =>
    btoa(
      crypto
        .getRandomValues(
          new Uint8Array(2)
        )
        .join('')
    );
</script>

<script lang="ts">
  import { GoogleAnalytics } from '@beyonk/svelte-google-analytics';
  import items from '@app/items';
  import Orb from '@app/Orb';

  let allSelected = false;
  let selected: string[] = [] as string[];

  $: {
    if (allSelected) {
      selected = $items.map(
        ({ id }) => id
      );
    } else {
      selected = [];
    }
  }

  const createItem = () => {
    items.update((prev) => [
      {
        id: generateID(),
        toDo: 'New Item',
      },
      ...prev,
    ]);
  };

  const updateItem = (id: string) => ({
    currentTarget,
  }: Event) => {
    if (!currentTarget) return;
    const target = currentTarget as HTMLDivElement;
    const { innerText } = target;
    items.update((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        return {
          id,
          toDo: innerText,
        };
      })
    );
  };

  const blurIfEnter = ({
    key,
    currentTarget,
  }: KeyboardEvent) => {
    if (
      !currentTarget ||
      key !== 'Enter'
    )
      return;
    const target = currentTarget as HTMLDivElement;
    target.blur();
  };

  const select = (id: string) => ({
    currentTarget,
  }: Event) => {
    const target = currentTarget as HTMLInputElement;
    if (target.checked) {
      selected = [...selected, id];
    } else {
      selected = selected.filter(
        (prevID) => prevID !== id
      );
    }
    if (
      selected.length >= $items.length
    ) {
      allSelected = true;
    } else if (selected.length === 0) {
      allSelected = false;
    }
  };

  const deleteOne = (
    id: string
  ) => () => {
    items.update((prev) =>
      prev.filter(
        ({ id: itemID }) =>
          itemID !== id
      )
    );
    selected = [];
    allSelected = false;
  };

  const deleteSelected = () => {
    for (
      let i = 0;
      i < selected.length;
      i++
    )
      deleteOne(selected[i])();
    selected = [];
  };

  const highlightAll = () => {
    document.execCommand(
      'selectAll',
      false
    );
  };
</script>

<GoogleAnalytics
  properties={[
    import.meta.env
      .SNOWPACK_PUBLIC_GOOGLE_ANALYTICS_ID,
  ]}
/>

<Orb />

<main>
  <h1>To Do or Not To Do...</h1>
  <header>
    <input
      type="checkbox"
      bind:checked={allSelected}
    />
    <button
      type="button"
      on:click={createItem}
    >
      New Item
    </button>
    {#if selected.length > 1}
      <button
        type="button"
        on:click={deleteSelected}
      >
        Delete Selected
      </button>
    {/if}
  </header>
  <section>
    {#each $items as { id, toDo }}
      <div class="item">
        <label for={`check-${id}`} />
        <div class="item-main">
          <input
            type="checkbox"
            id={`check-${id}`}
            on:change={select(id)}
            checked={selected.includes(
              id
            )}
          />
          <div
            class="name"
            contenteditable
            on:click={highlightAll}
            on:input|self={updateItem(
              id
            )}
            on:keypress={blurIfEnter}
          >
            {toDo}
          </div>
        </div>
        <button
          class="delete-one"
          type="button"
          on:click={deleteOne(id)}
        >
          Delete
        </button>
      </div>
    {/each}
  </section>
</main>

<style>
  main {
    width: 90%;
    max-width: 800px;
    margin: 64px auto;
  }
  header {
    padding: 8px;
    color: white;
    display: flex;
    border-radius: 4px;
    align-items: center;
    background: rgba(0, 0, 255, 0.56);
  }
  header button:not(:first-of-type) {
    margin-left: 8px;
  }
  div.item {
    padding: 8px;
    margin: 8px 0;
    display: flex;
    border-radius: 4px;
    position: relative;
    align-items: center;
    border: solid 1px #ccc;
    background: rgba(0, 0, 0, 0);
    transition: background 0.1s
      cubic-bezier(0.25, 0.1, 0.25, 1);
  }
  div.item:hover {
    background: rgba(0, 0, 0, 0.05);
  }
  div.item label {
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    cursor: pointer;
    position: absolute;
  }
  input[type='checkbox'] {
    margin-right: 8px;
  }
  div.item-main {
    width: 100%;
    display: flex;
    align-items: center;
    max-width: calc(100% - 80px);
  }
  div.name {
    z-index: 2;
    width: 100%;
    padding: 4px;
    overflow: hidden;
    position: relative;
    white-space: nowrap;
  }
  div.name:not(:focus) {
    text-overflow: ellipsis;
  }
  button {
    padding: 4px;
    font: inherit;
    cursor: pointer;
    appearance: none;
    font-size: 0.8em;
    border-radius: 2px;
    background: white;
    border: solid 1px #ccc;
    transition: background 0.1s
      cubic-bezier(0.25, 0.1, 0.25, 1);
  }
  button:hover {
    background: #eee;
  }
  button.delete-one {
    z-index: 2;
    width: 80px;
    margin-left: 8px;
    position: relative;
  }
</style>
