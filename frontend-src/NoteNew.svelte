<script>
  import { onMount, createEventDispatcher } from "svelte";
  import EasyMDE from "easymde";

  import { createNote } from "./api";

  const dispatch = createEventDispatcher();

  let title = "";

  let textarea;

  onMount(() => {
    const mdEditor = new EasyMDE({ element: textarea, forceSync: true, status: false });
    return () => {
      try {
        mdEditor.cleanup();
      } catch (_err) {}
    };
  });

  let errorMessage = ''
  const save = async () => {
    const text = textarea.value;
    if (!title && !text) {
      return;
    }
    try {
      const note = await createNote(title, text);
      dispatch("routeEvent", { type: "note-created", id: note.id });
    }
    catch(error) {
      console.error(error)
      errorMessage = error.message
    }
  };

  const cancel = () => {
    dispatch("routeEvent", { type: "note-create-cancelled" });
  };
</script>

<div class="uk-margin-bottom buttons">
  <button on:click={save} class="uk-button uk-button-primary"><i class="fas fa-save" />&nbsp;Сохранить</button>
  <button on:click={cancel} class="uk-button uk-button-default"><i class="fas fa-undo" />&nbsp;Отмена</button>
</div>

{#if errorMessage}
  <div class="uk-alert uk-alert-danger">
    <p>Ошибка: {errorMessage}.</p>
  </div>
{/if}

<div class="uk-margin"><input bind:value={title} class="uk-input" type="text" placeholder="Заголовок" /></div>

<div class="uk-margin"><textarea bind:this={textarea} class="uk-textarea" /></div>

<style>
@media (max-width: 767px) {
  .buttons button {
    margin-bottom: 10px;
    display: block;
    width: 100%;
  }
}
</style>
