<template>
    <div class="editor-toolbar">
        <button @click="toggleBold" :class="{ active: editor?.isActive('bold') }">
            <Bold size="18" />
        </button>

        <button @click="toggleItalic" :class="{ active: editor?.isActive('italic') }">
            <Italic size="18" />
        </button>

        <button @click="setHeading(1)" :class="{ active: editor?.isActive('heading', { level: 1 }) }">
            <Heading1 size="18" />
        </button>

        <button @click="setHeading(2)" :class="{ active: editor?.isActive('heading', { level: 2 }) }">
            <Heading2 size="18" />
        </button>

        <button @click="setHeading(3)" :class="{ active: editor?.isActive('heading', { level: 3 }) }">
            <Heading3 size="18" />
        </button>

        <button @click="toggleBulletList" :class="{ active: editor?.isActive('bulletList') }">
            <List size="18" />
        </button>

        <button @click="toggleOrderedList" :class="{ active: editor?.isActive('orderedList') }">
            <ListOrdered size="18" />
        </button>

    </div>

    <div class="editor-toolbar">
        <button @click="toggleLink" :class="{ active: editor?.isActive('link') }">
            <LinkIcon size="18" />
        </button>

        <button @click="editor.chain().focus().unsetLink().run()" :disabled="!editor?.isActive('link')">
          <UnlinkIcon size="18" />
        </button>
        
        <button @click="toggleBlockQuote" :class="{ active: editor?.isActive('blockQuote') }">
            <Quote size="18" />
        </button>

        <button @click="toggleCodeBlock" :class="{ active: editor?.isActive('codeBlock') }">
            <Code size="18" />
        </button>

        <button @click="addImage">
            <ImageIcon size="18" />
        </button>
    </div>

    <editor-content :editor="editor" class="editor-content" />

</template>

<script setup>
import { defineExpose } from 'vue'

import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Image from '@tiptap/extension-image'
import BulletList from '@tiptap/extension-bullet-list'
import Blockquote from '@tiptap/extension-blockquote'
import Link from '@tiptap/extension-link'
import ListItem from '@tiptap/extension-list-item'
import OrderedList from '@tiptap/extension-ordered-list'

import {
  Bold,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Image as ImageIcon,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Quote,
  Unlink as UnlinkIcon
} from 'lucide-vue-next'

const editor = useEditor({
    extensions: [
        
        StarterKit.configure({
            bulletList: false,
            orderedList: false,
        }),
        Placeholder.configure({
            placeholder: 'Write here ...',
        }),
        Blockquote,
        BulletList,
        OrderedList,
        ListItem,
        Image,
        Link.configure({
          openOnClick: false,
          defaultProtocol: 'https',
        }),
    ],
    content: `<p>Write ...</p>`  
})

defineExpose({
  getEditorContent: () => editor.value.getHTML()
})

// Action methods
function toggleBold() {
    editor.value?.chain().focus().toggleBold().run()
}

function toggleItalic() {
    editor.value?.chain().focus().toggleItalic().run()
}

function setHeading(level) {
    editor.value?.chain().focus().toggleHeading({ level }).run()
}

function toggleBulletList() {
    editor.value?.chain().focus().toggleBulletList().run()
}

function toggleOrderedList() {
    editor.value?.chain().focus().toggleOrderedList().run()
}

function toggleBlockQuote() {
    editor.value?.chain().focus().toggleBlockquote().run()
}

function toggleCodeBlock() {
    editor.value?.chain().focus().toggleCodeBlock().run()
}

function toggleLink() {
    const previousUrl = editor.value?.getAttributes('link').href
    const url = window.prompt('URL', previousUrl)

    if (url === null) {return}

    // empty
    if (url === '') {
    editor.value?.chain()
        .focus()
        .extendMarkRange('link')
        .unsetLink()
        .run()
    return
    }

    // update link
    editor.value?.chain()
    .focus()
    .extendMarkRange('link')
    .setLink({ href: url })
    .run()
}

function addImage() {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'

    input.onchange = async () => {
        const file = input.files[0]
        if (!file) return

        const reader = new FileReader()
        reader.onload = () => {
            const img = new window.Image()
            img.onload = () => {
                const canvas = document.createElement('canvas')
                const MAX_WIDTH = 500
                const scaleFactor = MAX_WIDTH / img.width

                canvas.width = MAX_WIDTH
                canvas.height = img.height * scaleFactor

                const ctx = canvas.getContext('2d')
                ctx.fillStyle = "#ffffff" // background putih untuk JPG
                ctx.fillRect(0, 0, canvas.width, canvas.height)
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

                // Konversi ke JPG base64 (walaupun aslinya PNG)
                const base64 = canvas.toDataURL('image/jpeg', 0.8)
                editor.value.chain().focus().setImage({ src: base64 }).run()
            }
            img.src = reader.result
        }
        reader.readAsDataURL(file)
    }

    input.click()
}

</script>

<style scoped>
.editor-toolbar {
    display: flex;
    gap: 8px;
    margin-bottom: 10px;
}

::v-deep(.ProseMirror img) {
    max-width: 100%;
    height: auto;
    display: block;
    margin: 12px auto;
    border-radius: 6px;
}

::v-deep(blockquote) {
  border-left: 4px solid #ccc;
  margin: 6px 0;
  color: #555;
  font-style: italic;
}

.editor-toolbar button {
    padding: 6px 10px;
    border: 1px solid #ddd;
    background: #f4f4f4;
    cursor: pointer;
    border-radius: 4px;
}

.editor-toolbar button.active {
    background: #333;
    color: white;
}

.editor-content {
    border: 1px solid #ccc;
    border-radius: 8px;
    padding: 16px;
    min-height: 300px;
    margin-bottom: 16px;
}

.submit-button {
    padding: 10px 16px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
}

/* Disable border black  */
.editor-content:focus-visible {
    outline: none;
}

.editor-content *:focus {
    outline: none !important;
    box-shadow: none !important;
}

  /* Placeholder (at the top) */
  p.is-editor-empty:first-child::before {
    color: black;
    content: attr(data-placeholder);
    float: left;
    height: 0;
    pointer-events: none;
  }

</style>