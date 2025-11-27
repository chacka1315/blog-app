import { Editor } from '@tinymce/tinymce-react';

export default function InsertEditor({ children, editorRef, initialValue }) {
  return (
    <>
      <Editor
        apiKey={import.meta.env.VITE_TINY_API_KEY}
        onInit={(evt, editor) => (editorRef.current = editor)}
        initialValue={initialValue}
        init={{
          height: 500,
          menu: {
            file: {
              title: 'File',
              items:
                'newdocument restoredraft | preview | importword exportpdf exportword | print | deleteallconversations',
            },
            edit: {
              title: 'Edit',
              items:
                'undo redo | cut copy paste pastetext | selectall | searchreplace',
            },
            view: {
              title: 'View',
              items:
                'code suggestededits revisionhistory | visualaid visualchars visualblocks | spellchecker | preview fullscreen | showcomments',
            },
            insert: {
              title: 'Insert',
              items:
                'image link media addcomment pageembed codesample inserttable | math | charmap emoticons hr | pagebreak nonbreaking anchor tableofcontents | insertdatetime',
            },
            format: {
              title: 'Format',
              items:
                'bold italic underline strikethrough superscript subscript codeformat | styles blocks fontfamily fontsize align lineheight | forecolor backcolor | language | removeformat',
            },
            tools: {
              title: 'Tools',
              items:
                'spellchecker spellcheckerlanguage | a11ycheck code wordcount',
            },
            table: {
              title: 'Table',
              items:
                'inserttable | cell row column | advtablesort | tableprops deletetable',
            },
            help: { title: 'Help', items: 'help' },
          },
          plugins: [
            'advlist',
            'autolink',
            'lists',
            'link',
            'image',
            'charmap',
            'preview',
            'anchor',
            'searchreplace',
            'visualblocks',
            'code',
            'fullscreen',
            'insertdatetime',
            'media',
            'table',
            'emoticons',
            'code',
            'help',
            'wordcount',
          ],

          fullscreen_native: true,
          toolbar:
            'undo redo | blocks fontsize | ' +
            'bold italic forecolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'removeformat | help',
          fontsize_formats:
            '8pt 9pt 10pt 11pt 12pt 14pt 18pt 24pt 30pt 36pt 48pt 60pt 72pt 96pt',
          toolbar_sticky: true,
          content_style:
            'body { font-family:Helvetica,Arial,sans-serif; font-size:14pt }',
        }}
      />
      {children}
    </>
  );
}
