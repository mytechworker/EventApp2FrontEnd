<template>
  <div class="editor rich-editor">
    <editor-menu-bar
      :editor="editor"
      @hide="hideLinkMenu"
      v-slot="{ commands, isActive, getMarkAttrs }"
    >
      <div class="menubar">
        <button
          class="menubar__button"
          :class="{ 'is-active': isActive.bold() }"
          @click="commands.bold"
        >
          <icon name="bold" />
        </button>

        <button
          class="menubar__button"
          :class="{ 'is-active': isActive.italic() }"
          @click="commands.italic"
        >
          <icon name="italic" />
        </button>

        <button
          class="menubar__button button-strike"
          :class="{ 'is-active': isActive.strike() }"
          @click="commands.strike"
        >
          <icon name="strike" />
        </button>

        <button
          class="menubar__button"
          :class="{ 'is-active': isActive.underline() }"
          @click="commands.underline"
        >
          <icon name="underline" />
        </button>

        <button
          class="menubar__button"
          :class="{ 'is-active': isActive.bullet_list() }"
          @click="commands.bullet_list"
        >
          <icon name="ul" />
        </button>

        <button
          class="menubar__button"
          :class="{ 'is-active': isActive.ordered_list() }"
          @click="commands.ordered_list"
        >
          <icon name="ol" />
        </button>

        <button
          class="menubar__button"
          :class="{ 'is-active': isActive.paragraph() }"
          @click="commands.paragraph"
        >
          <icon name="paragraph" />
        </button>

        <button class="menubar__button button-undo" @click="commands.undo">
          <icon name="undo" />
        </button>

        <button class="menubar__button button-redo" @click="commands.redo">
          <icon name="redo" />
        </button>

        <form
          class="menububble__form"
          v-if="linkMenuIsActive"
          @submit.prevent="setLinkUrl(commands.link, linkUrl)"
        >
          <input
            class="menububble__input"
            type="text"
            v-model="linkUrl"
            placeholder="https://"
            ref="linkInput"
            @keydown.esc="hideLinkMenu"
          />
          <button
            class="menububble__button"
            @click="setLinkUrl(commands.link, null)"
            type="button"
          >
            <icon name="remove" />
          </button>
        </form>

        <template v-else>
          <button
            class="menububble__button"
            @click="showLinkMenu(getMarkAttrs('link'))"
            :class="{ 'is-active': isActive.link() }"
          >
            <span>{{ isActive.link() ? "Update Link" : "Add Link" }}</span>
            <icon name="link" />
          </button>
        </template>
      </div>
    </editor-menu-bar>
    <editor-content
      class="editor__content"
      :editor="editor"
      :style="'height:' + height + 'px'"
    />
  </div>
</template>

<script>
import Icon from "@/components/icon";
import { Editor, EditorContent, EditorMenuBar } from "tiptap";
import {
  CodeBlock,
  HardBreak,
  Heading,
  HorizontalRule,
  OrderedList,
  BulletList,
  ListItem,
  TodoItem,
  TodoList,
  Bold,
  Code,
  Italic,
  Link,
  Strike,
  Underline,
  History,
} from "tiptap-extensions";
export default {
  components: {
    EditorContent,
    EditorMenuBar,
    Icon,
  },
  props: ["value", "height"],
  data() {
    return {
      editor: null,
      emitAfterOnUpdate: false,
      linkUrl: null,
      linkMenuIsActive: false,
    };
  },
  methods: {
    showLinkMenu(attrs) {
      this.linkUrl = attrs.href;
      this.linkMenuIsActive = true;
      this.$nextTick(() => {
        this.$refs.linkInput.focus();
      });
    },
    hideLinkMenu() {
      this.linkUrl = null;
      this.linkMenuIsActive = false;
    },
    setLinkUrl(command, url) {
      command({
        href: url,
      });
      this.hideLinkMenu();
    },
  },
  mounted() {
    this.editor = new Editor({
      extensions: [
        new BulletList(),
        new CodeBlock(),
        new HardBreak(),
        new Heading({ levels: [1, 2, 3] }),
        new HorizontalRule(),
        new ListItem(),
        new OrderedList(),
        new TodoItem(),
        new TodoList(),
        new Link(),
        new Bold(),
        new Code(),
        new Italic(),
        new Strike(),
        new Underline(),
        new History(),
      ],
      content: this.value,
      onUpdate: ({ getHTML }) => {
        this.emitAfterOnUpdate = true;
        this.$emit("input", getHTML());
      },
    });
    this.editor.setContent(this.value);
  },
  watch: {
    value(val) {
      if (this.emitAfterOnUpdate) {
        this.emitAfterOnUpdate = false;
        this.$emit("change");
        return;
      }
      if (this.editor) this.editor.setContent(val, false);
    },
  },
  beforeDestroy() {
    if (this.editor) {
      this.editor.destroy();
    }
  },
};
</script>

<style lang="scss">
@import "./../../style/components/_rich-editor.scss";
.new_event-editor{
  .editor__content .ProseMirror {
  height: 62px;
  p {
    line-height: 18px;
  }
}
}
.new_post-editor {
  .editor__content .ProseMirror {
    height: 136px;
    p {
      line-height: 18px;
    }
  }
}
</style>
