<script>
  import { createEventDispatcher } from "svelte";

  import { getNote, archiveUnarchiveNote, deleteNote, notePdfUrl } from "./api";

  import Progress from "./Progress.svelte";

  export let params;

  const dispatch = createEventDispatcher();

  $: p = getNote(params.id);

  const close = async () => {
    dispatch("routeEvent", { type: "note-closed", id: params.id });
  };

  let errorMessage
  const doArchive = async () => {
    try {
      await archiveUnarchiveNote(params.id, true);
      dispatch("routeEvent", { type: "note-archived", id: params.id });
    }
    catch (error) {
      console.error(error)
      errorMessage = error.message
    }
  };

  const doDelete = async () => {
    try {
      await deleteNote(params.id);
      dispatch("routeEvent", { type: "note-deleted", id: params.id });
    }
    catch (error) {
      console.error(error)
      errorMessage = error.message
    }
  };

  const doUnarchive = async () => {
    try {
      await archiveUnarchiveNote(params.id);
      dispatch("routeEvent", { type: "note-unarchived", id: params.id });
    }
    catch (error) {
      console.error(error)
      errorMessage = error.message
    }
  };

  const doEdit = () => {
    dispatch("routeEvent", { type: "note-edit-started", id: params.id });
  };
</script>

{#await p}
  <Progress />
{:then entry}
  <h1>{entry.title}</h1>
  <div class="uk-margin-bottom">
    {#if entry.is_archive }
      <button on:click={doDelete} class="uk-button uk-button-default"><i class="fas fa-trash" />&nbsp;Удалить</button>
      <button on:click={doUnarchive} class="uk-button uk-button-default"><i class="fas fa-archive" />&nbsp;Восстановить</button>
    {:else}
      <button on:click={doArchive} class="uk-button uk-button-default"><i class="fas fa-archive" />&nbsp;В архив</button>
    {/if}

    <button on:click={doEdit} class="uk-button uk-button-primary"><i class="fas fa-edit" />&nbsp;Редактировать</button>

    {#await notePdfUrl(entry.id) then link}
      {#if link }
        <a
          href={link.href}
          download="{link.name}"
          class="uk-button uk-button-secondary"
          target="_blank"
        >
          <i class="fas fa-file-download" />&nbsp;PDF
        </a>
    	{/if}
    {/await}

    <button on:click={close} class="uk-button uk-button-default"><i class="fas fa-times" />&nbsp;Закрыть</button>
  </div>
  <div class="uk-card uk-card-default uk-card-body">
    {@html entry.html}
  </div>
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
