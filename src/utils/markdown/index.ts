import { serialize, deserialize } from 'remark-slate'
import { fromMarkdown } from 'mdast-util-from-markdown'
import { get } from 'lodash-es'

import type { Descendant } from 'slate'

/*  

// replace incoming paragraph child with their children directly
// this is the preferred way for list elements in slate
// IMPORTANT: we are doing the reverse when exporting slate to md
// NOTE: There might be a problem with nested lists, but we will figure it out later

{
  "type": "ul_list",
  "children": [
    {
      "type": "list_item",
      "children": [
        {
          "type": "paragraph",
          "children": [
            {
              "text": "porumai"
            }
          ]
        }
      ]
    },
    {
      "type": "list_item",
      "children": [
        {
          "type": "paragraph",
          "children": [
            {
              "text": "amaidhi"
            }
          ]
        }
      ]
    }
  ]
}
*/
function unwrapListItems(listChildren: any[]) {
  return listChildren.map((li: any) => {
    // replace li item paragraph with its first child
    return {
      type: get(li, 'type', 'list_item'),
      children: get(li, 'children', []).map((y: any) => {
        return y.children[0]
      }),
    }
  })
}

// newline token; <br> tag will be replaced with this for better readability
// and to maintain new lines (md format does not allow more than one new lines)
// IMPORTANT: CRLF (\r\n) is used so that is not messed up with remark slate \n\n
const NEWLINE_TOKEN = '\r\n\r\n'

export function mdToSlate(md: string): Promise<any> {
  const parsed = fromMarkdown(md.replaceAll(NEWLINE_TOKEN, `<br>`))
  const output = parsed.children.map((v) => deserialize(v as any))

  const finalSlateTree: any[] = []

  output.forEach((v) => {
    const isList = get(v, 'type') === 'ul_list'
    if (isList) {
      const listChildren = get(v, 'children', [])
      const unwrapped = unwrapListItems(listChildren)
      finalSlateTree.push({
        type: 'ul_list',
        children: unwrapped,
      })
      // do not proceed
      return
    }

    // just push things as is
    finalSlateTree.push(v)
    // do notp proceed
    return
  })

  // insert empty line at the end for better editing
  // we are trimming empty lines anyway before saying
  finalSlateTree.push({
    break: true,
    type: 'paragraph',
    children: [{ text: '' }],
  })

  return new Promise((resolve) => {
    resolve(finalSlateTree)
  })
}

export function slateToMd(nodes: Descendant[]): Promise<string> {
  return new Promise((resolve) => {
    const parsed: string[] = []
    nodes.forEach((v) => {
      // list item handling
      // wrap children inside paragraphs
      const isList = get(v, 'type') === 'ul_list'
      if (isList) {
        const listChildren = get(v, 'children', []).map((x: any) => {
          return {
            ...x,
            children: [
              {
                type: 'paragraph',
                children: get(x, 'children', []),
              },
            ],
          }
        })
        const output = serialize({
          type: 'ul_list',
          children: listChildren,
        })
        parsed.push(output || '')
        // do not proceed
        return
      }

      // dealing with remark-slate fragile code
      const isParagraph = get(v, 'type') === 'paragraph'
      // if paragraph, we will trim all the child {text: '\n'}
      if (isParagraph) {
        // @ts-ignore
        const paraChildren = v.children.filter((x) => {
          const emptyLine = x && x.text && x.text === '\n'

          return !emptyLine
        })
        const output = serialize({
          type: 'paragraph',
          children: paraChildren,
        })
        parsed.push(output || '')
        // do not proceed
        return
      }

      const output = serialize(v)
      parsed.push(output || '')

      // do not proceed
      return
    })
    const finalMd = parsed.join('').replaceAll('<br>', NEWLINE_TOKEN).trim()

    return resolve(finalMd)
  })
}
