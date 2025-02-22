<script>
  import Router, { link, location, push } from "svelte-spa-router";

  import { routerPrefix, routePatterns, getActiveNoteId } from "./lib";
  import { deleteAllArchived } from "./api";
  import { getNotes } from "./api";

  import NoteCard from "./NoteCard.svelte";
  import Progress from "./Progress.svelte";
  import NoteView from "./NoteView.svelte";
  import NoteNew from "./NoteNew.svelte";
  import NoteEdit from "./NoteEdit.svelte";

  export const routes = {
    [routePatterns.new]: NoteNew,
    [routePatterns.view]: NoteView,
    [routePatterns.edit]: NoteEdit,
  };

  $: activeNoteId = getActiveNoteId($location);

  let fetching;
  let search = "";
  let age = "1week";
  let page = 1;
  let entries = [];
  let errorMessage = "";

  // Logout all tabs: receive
  const logoutChannel = new BroadcastChannel("logoutChannel");
  logoutChannel.onmessage = () => window.location.reload();

  // Login all tabs: send
  const loginChannel = new BroadcastChannel("loginChannel");
  loginChannel.postMessage("login");

  const fetch = ({ reset = false } = {}) => {
    if (reset) {
      page = 1;
      entries = [];
    }
    return (fetching = getNotes({ age, search, page }).then((data) => {
      entries = entries.concat(data.data);
      return data.hasMore;
    }));
  };

  fetch();

  const loadMore = () => {
    page += 1;
    return fetch();
  };

  const fetchFromScratch = ({ resetNav = true } = {}) => {
    errorMessage = "";

    if (resetNav) {
      push("/");
    }
    return fetch({ reset: true });
  };

  const refetch = async () => {
    let oldPage = page;
    await fetchFromScratch({ resetNav: false });
    while (page < oldPage) {
      await loadMore();
    }
  };

  const deleteAll = async () => {
    try {
      await deleteAllArchived();
      age = "1week";
      fetchFromScratch();
    }
    catch(error) {
      console.error(error)
      errorMessage = error.message
    }
  };

  let timeoutId
  const fulltextSearch = () => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fetchFromScratch(), 500)
  }

  const routeEvent = (event) => {
    const { type, id } = (event && event.detail) || {};
    switch (type) {
      case "note-create-cancelled":
      case "note-closed":
        push("/");
        break;
      case "note-deleted":
      case "note-archived":
      case "note-unarchived":
        push("/");
        refetch();
        break;
      case "note-edit-started":
        push(`/note/${id}/edit`);
        break;
      case "note-edit-cancelled":
        push(`/note/${id}`);
        break;
      case "note-created":
      case "note-edited":
        push(`/note/${id}`);
        refetch();
        break;
    }
  };

  const clickHandler = (id) => {
    const scrollDiv = document.getElementById(id).offsetTop;
    window.scrollTo({ top: scrollDiv - 50, behavior: 'smooth'});
  };
</script>

<section class="main-nav">
  <div class="item-nav" on:click={() => clickHandler("nav")}>Навигация</div>
  <div class="item-nav" on:click={() => clickHandler("note")}>Заметка</div>
</section>

<section class="uk-flex uk-grid-collapse uk-flex-mobile">
  <aside id="nav" class="uk-width-1-4 uk-padding-small nav">
    {#if age !== 'archive'}
      {#if activeNoteId === 'new'}
        <button disabled class="uk-button uk-button-primary uk-display-block uk-width-1-1">Новая заметка</button>
      {:else}
        <a use:link={'/note/new'} href="/" class="uk-button uk-button-primary uk-display-block uk-width-1-1">Новая
          заметка</a>
      {/if}
    {:else if entries.length}
      <button on:click={deleteAll} class="uk-button uk-button-secondary uk-display-block uk-width-1-1">Удалить весь
        архив</button>
    {/if}

    <p>
      <!-- svelte-ignore a11y-no-onchange -->
      <select bind:value={age} on:change={fetchFromScratch} class="uk-select">
        <option value="1week">за неделю</option>
        <option value="1month">за месяц</option>
        <option value="3months">за 3 месяца</option>
        <option value="alltime">за всё время</option>
        <option value="archive">архив</option>
      </select>
    </p>
    <p class="uk-search uk-search-default uk-width-1-1">
      <i uk-search-icon class="uk-icon uk-search-icon fas fa-search" />
      <input
        bind:value={search}
        on:keyup={fulltextSearch}
        class="uk-search-input uk-width-1-1"
        type="search"
        placeholder="Поиск по заголовку" />
    </p>

    {#each entries as entry}
      <NoteCard {entry} isActive={entry.id === activeNoteId} />
    {/each}

    {#await fetching}
      <Progress />
    {:then hasMore}
      {#if hasMore}
        <button
          on:click={loadMore}
          class="uk-button uk-button-secondary uk-margin-top uk-display-block uk-width-1-1">Загрузить ещё&hellip;</button>
      {/if}
    {:catch error}
      <div class="uk-alert uk-alert-danger">
        <p>Ошибка: {error.message}.</p>
      </div>
    {/await}

    {#if errorMessage}
      <div class="uk-alert uk-alert-danger">
        <p>Ошибка: {errorMessage}.</p>
      </div>
    {/if}
  </aside>
  <div id="note" class="uk-width-3-4 uk-padding-small content">
    <Router
      {routes}
      prefix={routerPrefix}
      on:routeEvent={routeEvent}
      on:routeLoaded={() => {
        window.scrollTo(0, 0);
      }} />
  </div>
</section>

<style>
.main-nav {
  display: none;
}

@media (max-width: 767px) {
  .main-nav {
    position: sticky;
    top: 0;
    margin-top: 20px;
    display: flex;
    z-index: 10;
    background-color: #f8f8f8;
  }

  .item-nav {
    width: 50%;
    padding: 10px 0;
    text-align: center;
    color: #1e87f0;
  }

  .uk-flex-mobile {
    display: block;
  }

  .nav,
  .content {
    margin: 20px 0;
    padding: 0;
    width: 100%;
  }
}
</style>
