import * as pdfMake from 'pdfmake/build/pdfmake'
import { On } from 'better-write-plugin-core'
import {
  ContextState,
  Entity,
  PDFDocOptions,
  PluginTypes,
} from 'better-write-types'
import { nextTick, computed } from 'vue-demi'
import { useNProgress } from '@vueuse/integrations'
import { useToast } from 'vue-toastification'
import { getPDFUtils } from 'better-write-plugin-theme'
import { useOnline } from '@vueuse/core'
import { getStandardVFS } from './externals'
import { Maybe } from 'better-write-types'

export const PluginPDFSet = (
  emitter: PluginTypes.PluginEmitter,
  stores: PluginTypes.PluginStores,
  hooks: PluginTypes.PluginHooks
) => {
  let __FIRST__HEADING__ONE__ = true

  const { isLoading } = useNProgress()
  const toast = useToast()
  const online = useOnline()

  const isTheme = computed(() => stores.PDF.styles.switcher.theme)

  const utils = () => {
    const isOnline = () => {
      return online.value && stores.PDF.normalize.length !== 0
    }

    const correctFontInject = (font: string) => {
      return isOnline() ? font : 'Roboto'
    }

    return { isOnline, correctFontInject }
  }

  const transform = () => {
    const pageOrientation = (b: string) => {
      let value: Maybe<string> = null
      let __STOP__: boolean = false

      hooks.i18n.availableLocales.forEach((locale: string) => {
        if (__STOP__) return

        const { editor } = hooks.i18n.getLocaleMessage(locale)

        switch (b) {
          case editor.pdf.configuration.orientation.portrait:
            __STOP__ = true
            value = 'portrait'
            break
          case editor.pdf.configuration.orientation.landscape:
            __STOP__ = true
            value = 'landscape'
            break
          default:
            __STOP__ = false
        }
      })

      return value
    }

    const footerStyle = (b: string) => {
      let value: Maybe<string> = null
      let __STOP__: boolean = false

      hooks.i18n.availableLocales.forEach((locale: string) => {
        if (__STOP__) return

        const { editor } = hooks.i18n.getLocaleMessage(locale)

        switch (b) {
          case editor.pdf.configuration.footer.style.simple:
            __STOP__ = true
            value = 'simple'
            break
          case editor.pdf.configuration.footer.style.counter:
            __STOP__ = true
            value = 'counter'
            break
          default:
            __STOP__ = false
        }
      })

      return value
    }

    const summaryStyle = (b: string) => {
      let value: Maybe<string> = null
      let __STOP__: boolean = false

      hooks.i18n.availableLocales.forEach((locale: string) => {
        if (__STOP__) return

        const { editor } = hooks.i18n.getLocaleMessage(locale)

        switch (b) {
          case editor.pdf.configuration.summary.style.default:
            __STOP__ = true
            value = 'default'
            break
          default:
            __STOP__ = false
        }
      })

      return value
    }

    const alignment = (b: string): string => {
      let value: Maybe<string> = null
      let __STOP__: boolean = false

      hooks.i18n.availableLocales.forEach((locale: string) => {
        if (__STOP__) return

        const { editor } = hooks.i18n.getLocaleMessage(locale)

        switch (b) {
          case editor.pdf.configuration.alignment.default:
            __STOP__ = true
            value = 'default'
            break
          case editor.pdf.configuration.alignment.left:
            __STOP__ = true
            value = 'left'
            break
          case editor.pdf.configuration.alignment.center:
            __STOP__ = true
            value = 'center'
            break
          case editor.pdf.configuration.alignment.right:
            __STOP__ = true
            value = 'right'
            break
          default:
            __STOP__ = false
        }
      })

      return value
    }

    const entityAlignment = (b: string): string => {
      let value: Maybe<string> = null
      let __STOP__: boolean = false

      hooks.i18n.availableLocales.forEach((locale: string) => {
        if (__STOP__) return

        const { editor } = hooks.i18n.getLocaleMessage(locale)

        switch (b) {
          case editor.pdf.configuration.alignment.justify:
            __STOP__ = true
            value = 'justify'
            break
          case editor.pdf.configuration.alignment.left:
            __STOP__ = true
            value = 'left'
            break
          case editor.pdf.configuration.alignment.center:
            __STOP__ = true
            value = 'center'
            break
          case editor.pdf.configuration.alignment.right:
            __STOP__ = true
            value = 'right'
            break
          default:
            __STOP__ = false
        }
      })

      return value
    }

    return {
      pageOrientation,
      footerStyle,
      summaryStyle,
      alignment,
      entityAlignment,
    }
  }

  const generate = () => {
    const { theme } = getPDFUtils()

    const headingOne = (raw: string) => {
      return {
        text: raw,
        margin: [
          generate().base().pageMargins[0],
          stores.PDF.styles.headingOne.margin.top,
          generate().base().pageMargins[2],
          stores.PDF.styles.headingOne.margin.bottom,
        ],
        pageBreak:
          stores.PDF.styles.headingOne.breakPage &&
          !hooks.project.isBlankProject() &&
          !__FIRST__HEADING__ONE__
            ? 'before'
            : undefined,
        style: 'heading-one',
        tocItem:
          stores.PDF.styles.switcher.summary &&
          transform().summaryStyle(stores.PDF.styles.base.summary.type) ===
            'default',
      }
    }

    const headingTwo = (raw: string) => {
      return {
        text: raw,
        margin: [
          generate().base().pageMargins[0],
          stores.PDF.styles.headingTwo.margin.top,
          generate().base().pageMargins[2],
          stores.PDF.styles.headingTwo.margin.bottom,
        ],
        style: 'heading-two',
        tocItem:
          stores.PDF.styles.switcher.summary &&
          hooks.project.isBlankProject() &&
          transform().summaryStyle(stores.PDF.styles.base.summary.type) ===
            'default',
      }
    }

    const headingThree = (raw: string) => {
      return {
        text: raw,
        margin: [
          generate().base().pageMargins[0],
          stores.PDF.styles.headingThree.margin.top,
          generate().base().pageMargins[2],
          stores.PDF.styles.headingThree.margin.bottom,
        ],
        style: 'heading-three',
      }
    }

    const paragraph = (entity: Entity) => {
      const obj = entity.external?.paragraph?.active
        ? {
            font: utils().correctFontInject(
              entity.external?.paragraph?.generator.font
            ),
            fontSize: entity.external?.paragraph?.generator.fontSize,
            lineHeight: entity.external?.paragraph?.generator.lineHeight,
            alignment: transform().entityAlignment(
              entity.external?.paragraph?.generator.alignment as any
            ),
            characterSpacing:
              entity.external?.paragraph?.generator.characterSpacing,
            color: entity.external?.paragraph?.generator.color,
            background: entity.external?.paragraph?.generator.background,
            italics: entity.external?.paragraph?.generator.italics,
            bold: entity.external?.paragraph?.generator.bold,
          }
        : {}

      let indent = ''

      const quantity =
        entity.external?.paragraph?.active &&
        entity.external?.paragraph?.generator.indent
          ? entity.external?.paragraph?.generator.indent
          : stores.PDF.styles.paragraph.indent

      for (let i = 0; i < quantity; i++) {
        indent += '\t'
      }

      return {
        text: hooks.raw
          .v2()
          .purge()
          .pdf(indent + entity.raw),
        style: entity.external?.paragraph?.active ? 'none' : 'paragraph',
        preserveLeadingSpaces: true,
        margin: [
          generate().base().pageMargins[0],
          entity.external?.paragraph?.active
            ? entity.external.paragraph.generator.margin.top
            : stores.PDF.styles.paragraph.margin.top,
          generate().base().pageMargins[2],
          entity.external?.paragraph?.active
            ? entity.external.paragraph.generator.margin.bottom
            : stores.PDF.styles.paragraph.margin.bottom,
        ],
        ...obj,
      }
    }

    const pageBreak = () => {
      return {
        text: '',
        style: 'page-break',
        pageBreak: 'after',
      }
    }

    const lineBreak = (fixed: boolean = true, final: boolean) => {
      if (!final && fixed) return

      if (
        stores.PDF.styles.lineBreak.image.data &&
        stores.PDF.styles.lineBreak.image.active &&
        fixed
      ) {
        if (stores.PDF.styles.lineBreak.image.data.startsWith('<svg')) {
          return {
            svg: stores.PDF.styles.lineBreak.image.data,
            width: stores.PDF.styles.lineBreak.image.width,
            height: stores.PDF.styles.lineBreak.image.height,
            alignment: 'center',
            margin: [
              0,
              stores.PDF.styles.lineBreak.spacing,
              0,
              stores.PDF.styles.lineBreak.spacing,
            ],
          }
        }

        return {
          image: stores.PDF.styles.lineBreak.image.data,
          width: stores.PDF.styles.lineBreak.image.width,
          height: stores.PDF.styles.lineBreak.image.height,
          alignment: 'center',
          margin: [
            0,
            stores.PDF.styles.lineBreak.spacing,
            0,
            stores.PDF.styles.lineBreak.spacing,
          ],
        }
      }

      return {
        text: '',
        margin: [0, fixed ? stores.PDF.styles.lineBreak.spacing : 8],
        style: 'line-break',
      }
    }

    const image = (entity: Entity) => {
      if (entity.external?.image?.alignment === 'full') {
        if (entity.external.image.name.endsWith('svg')) {
          return {
            svg: entity.raw,
            width:
              hooks.defines.pdf().base().pageSizeFixes()[
                stores.PDF.styles.base.pageSize
              ][0] -
              generate().base().pageMargins[0] -
              generate().base().pageMargins[2],
            margin: [
              generate().base().pageMargins[0],
              10,
              generate().base().pageMargins[2],
              10,
            ],
          }
        }

        return {
          image: entity.raw,
          width:
            hooks.defines.pdf().base().pageSizeFixes()[
              stores.PDF.styles.base.pageSize
            ][0] -
            generate().base().pageMargins[0] -
            generate().base().pageMargins[2],
          margin: [
            generate().base().pageMargins[0],
            10,
            generate().base().pageMargins[2],
            10,
          ],
        }
      } else {
        if (entity.external?.image?.name.endsWith('svg')) {
          return {
            svg: entity.raw,
            width: entity.external?.image?.size.width,
            height: entity.external?.image?.size.height,
            alignment: entity.external?.image?.alignment,
            margin: [
              entity.external?.image?.alignment === 'center'
                ? 0
                : generate().base().pageMargins[0] / 2,
              10,
              entity.external?.image?.alignment === 'right' ||
              entity.external?.image?.alignment === 'center'
                ? 0
                : generate().base().pageMargins[2] / 2,
              10,
            ],
          }
        }

        return {
          image: entity.raw,
          width: entity.external?.image?.size.width,
          height: entity.external?.image?.size.height,
          alignment: entity.external?.image?.alignment,
          margin: [
            entity.external?.image?.alignment === 'center'
              ? 0
              : generate().base().pageMargins[0],
            10,
            entity.external?.image?.alignment === 'right' ||
            entity.external?.image?.alignment === 'center'
              ? 0
              : generate().base().pageMargins[2],
            10,
          ],
        }
      }
    }

    const frontCover = (arr: Array<any>) => {
      if (!stores.PDF.styles.base.background.data) {
        let _title = {
          text: stores.PROJECT.nameRaw,
          fontSize: 42,
          font: utils().correctFontInject(stores.PDF.styles.headingOne.font),
          color: isTheme.value
            ? theme.paragraph
            : stores.PDF.styles.paragraph.color,
          alignment: 'center',
          margin: [0, 50],
        }

        let _subject = {
          text: stores.PROJECT.subject,
          fontSize: 11,
          font: utils().correctFontInject(stores.PDF.styles.paragraph.font),
          margin: [
            generate().base().pageMargins[0],
            50,
            generate().base().pageMargins[2],
            0,
          ],
          color: isTheme.value
            ? theme.paragraph
            : stores.PDF.styles.paragraph.color,
          alignment: 'center',
        }

        let _creator = {
          text: stores.PROJECT.creator,
          fontSize: 11,
          font: utils().correctFontInject(stores.PDF.styles.paragraph.font),
          margin: [
            generate().base().pageMargins[0],
            250,
            generate().base().pageMargins[2],
            0,
          ],
          color: isTheme.value
            ? theme.paragraph
            : stores.PDF.styles.paragraph.color,
          alignment: 'left',
          pageBreak: 'after',
        }

        arr.push(_title)
        arr.push(_subject)
        arr.push(_creator)

        return
      }

      let _raw = {
        image: stores.PDF.styles.base.background.data,
        pageBreak: 'after',
        width: hooks.defines.pdf().base().pageSizeFixes()[
          stores.PDF.styles.base.pageSize
        ][0],
        height: hooks.defines.pdf().base().pageSizeFixes()[
          stores.PDF.styles.base.pageSize
        ][1],
      }

      arr.push(_raw)
    }

    const summary = (arr: Array<any>) => {
      if (stores.PDF.styles.switcher.summary) {
        let _raw = {
          toc: {
            title: {
              text: stores.PROJECT.nameRaw,
              font: utils().correctFontInject(
                stores.PDF.styles.base.summary.fontFamily
              ),
              fontSize: stores.PDF.styles.base.summary.fontSize,
            },
          },
          pageBreak: 'after',
          alignment: 'center',
          font: utils().correctFontInject(
            stores.PDF.styles.base.summary.fontFamily
          ),
          style: 'summary-default',
        }

        arr.push(_raw)
      }
    }

    const content = (options: PDFDocOptions): Array<any> => {
      const pages: Array<ContextState> = []
      const arr: Array<any> = []

      options.chapters.forEach((chapter: any) => {
        if (chapter.select) pages.push(chapter.page)
      })

      if (hooks.project.isCreativeProject()) {
        if (stores.PDF.styles.switcher.cover) frontCover(arr)
        summary(arr)
      }

      pages.forEach((page: ContextState) => {
        page.entities.forEach((entity: Entity) => {
          let _raw: any = {}

          if (
            entity.raw === hooks.env.emptyLine() &&
            entity.type === 'paragraph'
          ) {
            _raw = lineBreak(false, options.final)

            if (_raw) arr.push(_raw)

            return
          }

          if (entity.type === 'paragraph') {
            _raw = paragraph(entity)
          } else if (entity.type === 'heading-one') {
            _raw = headingOne(entity.raw)

            __FIRST__HEADING__ONE__ = false
          } else if (entity.type === 'heading-two') {
            _raw = headingTwo(entity.raw)
          } else if (entity.type === 'heading-three') {
            _raw = headingThree(entity.raw)
          } else if (entity.type === 'page-break') {
            _raw = pageBreak()
          } else if (entity.type === 'line-break') {
            _raw = lineBreak(true, options.final)
          } else if (entity.type === 'image') {
            if (!options.final) return

            _raw = image(entity)
          }

          arr.push(_raw)
        })
      })

      return arr
    }

    const base = (): Record<string, any> => {
      return {
        pageSize: stores.PDF.styles.base.pageSize,
        pageOrientation: transform().pageOrientation(
          stores.PDF.styles.base.pageOrientation
        ),
        pageMargins: [
          stores.PDF.styles.base.pageMargins.left,
          stores.PDF.styles.base.background.data
            ? 0
            : stores.PDF.styles.base.pageMargins.top,
          stores.PDF.styles.base.pageMargins.right,
          stores.PDF.styles.base.background.data
            ? 0
            : stores.PDF.styles.base.pageMargins.bottom,
        ],
      }
    }

    const styles = () => {
      const paragraph = () => {
        return {
          font: utils().correctFontInject(stores.PDF.styles.paragraph.font),
          fontSize: stores.PDF.styles.paragraph.fontSize,
          lineHeight: stores.PDF.styles.paragraph.lineHeight,
          alignment: transform().entityAlignment(
            stores.PDF.styles.paragraph.alignment
          ),
          characterSpacing: stores.PDF.styles.paragraph.characterSpacing,
          color: isTheme.value
            ? theme.paragraph
            : stores.PDF.styles.paragraph.color,
          decorationColor: stores.PDF.styles.paragraph.decorationColor,
        }
      }

      const headingOne = () => {
        return {
          font: utils().correctFontInject(stores.PDF.styles.headingOne.font),
          fontSize: stores.PDF.styles.headingOne.fontSize,
          lineHeight: stores.PDF.styles.headingOne.lineHeight,
          bold: stores.PDF.styles.headingOne.bold,
          italics: stores.PDF.styles.headingOne.italics,
          alignment: transform().entityAlignment(
            stores.PDF.styles.headingOne.alignment
          ),
          characterSpacing: stores.PDF.styles.headingOne.characterSpacing,
          color: isTheme.value
            ? theme['heading-one']
            : stores.PDF.styles.headingOne.color,
          decorationColor: stores.PDF.styles.headingOne.decorationColor,
        }
      }

      const headingTwo = () => {
        return {
          font: utils().correctFontInject(stores.PDF.styles.headingTwo.font),
          fontSize: stores.PDF.styles.headingTwo.fontSize,
          lineHeight: stores.PDF.styles.headingTwo.lineHeight,
          bold: stores.PDF.styles.headingTwo.bold,
          italics: stores.PDF.styles.headingTwo.italics,
          alignment: transform().entityAlignment(
            stores.PDF.styles.headingTwo.alignment
          ),
          characterSpacing: stores.PDF.styles.headingTwo.characterSpacing,
          color: isTheme.value
            ? theme['heading-two']
            : stores.PDF.styles.headingTwo.color,
          decorationColor: stores.PDF.styles.headingTwo.decorationColor,
        }
      }

      const headingThree = () => {
        return {
          font: utils().correctFontInject(stores.PDF.styles.headingThree.font),
          fontSize: stores.PDF.styles.headingThree.fontSize,
          lineHeight: stores.PDF.styles.headingThree.lineHeight,
          bold: stores.PDF.styles.headingThree.bold,
          italics: stores.PDF.styles.headingThree.italics,
          alignment: transform().entityAlignment(
            stores.PDF.styles.headingThree.alignment
          ),
          characterSpacing: stores.PDF.styles.headingThree.characterSpacing,
          color: isTheme.value
            ? theme['heading-three']
            : stores.PDF.styles.headingThree.color,
          decorationColor: stores.PDF.styles.headingThree.decorationColor,
        }
      }

      const summaryDefault = () => {
        return {
          margin: [
            generate().base().pageMargins[0],
            30,
            generate().base().pageMargins[2],
            30,
          ],
          color: isTheme.value
            ? theme.paragraph
            : stores.PDF.styles.paragraph.color,
        }
      }

      const background = () => {
        return {
          type: 'rect',
          x: 0,
          y: 0,
          w: hooks.defines.pdf().base().pageSizeFixes()[
            stores.PDF.styles.base.pageSize
          ][0],
          h: hooks.defines.pdf().base().pageSizeFixes()[
            stores.PDF.styles.base.pageSize
          ][1],
          color: isTheme.value
            ? theme.page
            : stores.PDF.styles.base.background.color,
        }
      }

      return {
        paragraph,
        headingOne,
        headingTwo,
        headingThree,
        summaryDefault,
        background,
      }
    }

    return { content, styles, base }
  }

  const doc = (options: PDFDocOptions) => {
    const encrypt = () => {
      return stores.PDF.styles.switcher.encryption
        ? {
            userPassword: stores.PDF.encryption.userPassword,
            ownerPassword: stores.PDF.encryption.ownerPassword,
            permissions: {
              printing: stores.PDF.permissions.printing,
              modifying: stores.PDF.permissions.modifying,
              copying: stores.PDF.permissions.copying,
              annotating: stores.PDF.permissions.annotating,
              fillingForms: stores.PDF.permissions.fillingForms,
              contentAccessibility: stores.PDF.permissions.contentAccessibility,
              documentAssembly: stores.PDF.permissions.documentAssembly,
            },
          }
        : {}
    }

    const page = () => {
      return {
        pageSize: generate().base().pageSize,
        pageOrientation: generate().base().pageOrientation,
        pageMargins: {
          left: 0,
          top: generate().base().pageMargins[1],
          right: 0,
          bottom: generate().base().pageMargins[3],
        },
      }
    }

    const info = () => {
      return {
        info: {
          title: stores.PROJECT.name,
          author: stores.PROJECT.creator,
          subject: stores.PROJECT.subject,
          producer: stores.PROJECT.producer,
          keywords: stores.PROJECT.keywords,
        },
      }
    }

    const content = () => {
      return {
        content: generate().content(options),
        styles: {
          'heading-three': generate().styles().headingThree(),
          'heading-two': generate().styles().headingTwo(),
          'heading-one': generate().styles().headingOne(),
          'summary-default': generate().styles().summaryDefault(),
          paragraph: generate().styles().paragraph(),
        },
      }
    }

    const footer = () => {
      const text = (
        currentPage: number,
        pageCount: number,
        pageSize: number
      ) => {
        return currentPage >= stores.PDF.styles.base.footer.start
          ? transform().footerStyle(stores.PDF.styles.base.footer.textType) ===
            'simple'
            ? currentPage.toString()
            : `${currentPage.toString()}/${pageCount}`
          : ''
      }

      const alignment = (
        currentPage: number,
        pageCount: number,
        pageSize: number
      ): any => {
        if (
          transform().alignment(stores.PDF.styles.base.footer.alignment) ===
          'default'
        ) {
          return currentPage % 2 ? 'left' : 'right'
        }

        if (
          transform().alignment(stores.PDF.styles.base.footer.alignment) ===
          'center'
        ) {
          return 'center'
        }

        if (
          transform().alignment(stores.PDF.styles.base.footer.alignment) ===
          'left'
        ) {
          return 'left'
        }

        if (
          transform().alignment(stores.PDF.styles.base.footer.alignment) ===
          'right'
        ) {
          return 'right'
        }
      }

      return { document, alignment, text }
    }

    const header = () => {
      stores.PDF.styles.base.header.content
      const text = (
        currentPage: number,
        pageCount: number,
        pageSize: number
      ) => {
        return currentPage >= stores.PDF.styles.base.header.start
          ? stores.PDF.styles.base.header.content
          : ''
      }

      const alignment = (
        currentPage: number,
        pageCount: number,
        pageSize: number
      ): any => {
        if (
          transform().alignment(stores.PDF.styles.base.header.alignment) ===
          'default'
        ) {
          return currentPage % 2 ? 'left' : 'right'
        }

        if (
          transform().alignment(stores.PDF.styles.base.header.alignment) ===
          'center'
        ) {
          return 'center'
        }

        if (
          transform().alignment(stores.PDF.styles.base.header.alignment) ===
          'left'
        ) {
          return 'left'
        }

        if (
          transform().alignment(stores.PDF.styles.base.header.alignment) ===
          'right'
        ) {
          return 'right'
        }
      }

      return { alignment, text }
    }

    const addons = () => {
      const { theme } = getPDFUtils()

      return {
        background: options.final
          ? function (currentPage: number) {
              return currentPage >= 3 &&
                stores.PDF.styles.base.background.main &&
                stores.PDF.styles.switcher.main
                ? [
                    {
                      image: stores.PDF.styles.base.background.main,
                      width: hooks.defines.pdf().base().pageSizeFixes()[
                        stores.PDF.styles.base.pageSize
                      ][0],
                      height: hooks.defines.pdf().base().pageSizeFixes()[
                        stores.PDF.styles.base.pageSize
                      ][1],
                    },
                  ]
                : currentPage <= 1 &&
                  stores.PDF.styles.switcher.cover &&
                  stores.PDF.styles.base.background.data
                ? undefined
                : !isTheme.value &&
                  stores.PDF.styles.base.background.color === '#FFFFFF'
                ? undefined
                : [
                    {
                      canvas: [generate().styles().background()],
                    },
                  ]
            }
          : undefined,
        footer: stores.PDF.styles.switcher.footer
          ? function (
              currentPage: number,
              pageCount: number,
              pageSize: number
            ) {
              return [
                {
                  text: footer().text(currentPage, pageCount, pageSize),
                  margin: [15, 0],
                  fontSize: stores.PDF.styles.base.footer.textSize,
                  font: utils().correctFontInject(
                    stores.PDF.styles.base.footer.fontFamily
                  ),
                  alignment: footer().alignment(
                    currentPage,
                    pageCount,
                    pageSize
                  ),
                  color: isTheme.value
                    ? theme.paragraph
                    : stores.PDF.styles.paragraph.color,
                },
              ]
            }
          : undefined,
        header: stores.PDF.styles.switcher.header
          ? function (currentPage: number, pageCount: number, pageSize: any) {
              return [
                {
                  text: header().text(currentPage, pageCount, pageSize),
                  fontSize: stores.PDF.styles.base.header.textSize,
                  font: utils().correctFontInject(
                    stores.PDF.styles.base.header.fontFamily
                  ),
                  decoration: 'underline',
                  alignment: header().alignment(
                    currentPage,
                    pageCount,
                    pageSize
                  ),
                  color: isTheme.value
                    ? theme.paragraph
                    : stores.PDF.styles.paragraph.color,
                },
              ]
            }
          : undefined,
        pageBreakBefore: function (currentNode: any) {
          if (
            currentNode.id === 'signature' &&
            (currentNode.pageNumbers.length != 1 ||
              currentNode.pageNumbers[0] != currentNode.pages)
          ) {
            return true
          } else if (
            currentNode.id === 'closingParagraph' &&
            currentNode.pageNumbers.length != 1
          ) {
            return true
          }
          return false
        },
      }
    }

    return {
      ...encrypt(),
      ...page(),
      ...info(),
      ...content(),
      ...addons(),
    }
  }

  const setVfsFonts = () => {
    const _fonts: Array<string> = []
    const set: Record<string, any> = {}

    _fonts.push(stores.PDF.styles.paragraph.font)
    _fonts.push(stores.PDF.styles.headingOne.font)
    _fonts.push(stores.PDF.styles.headingTwo.font)
    _fonts.push(stores.PDF.styles.headingThree.font)
    _fonts.push(stores.PDF.styles.base.header.fontFamily)
    _fonts.push(stores.PDF.styles.base.footer.fontFamily)
    _fonts.push(stores.PDF.styles.base.summary.fontFamily)
    stores.PROJECT.pages.forEach((page: ContextState) => {
      page.entities.forEach((entity: Entity) => {
        if (
          entity.external?.paragraph?.generator.font &&
          entity.external.paragraph.active
        ) {
          _fonts.push(entity.external?.paragraph?.generator.font)
        }
      })
    })

    const unique = _fonts.filter((v, i, a) => a.indexOf(v) === i)

    if (!utils().isOnline()) {
      // now online, reload google fonts
      if (online.value && stores.PDF.normalize.length === 0) {
        toast(hooks.i18n.t('editor.pdf.inserts.nowOnline'))

        return
      }

      // roboto raw .ttf
      pdfMake.addVirtualFileSystem(getStandardVFS().vfs)
    } else {
      unique.forEach((s: string) => {
        set[s] = stores.PDF.normalize[s]
      })

      if (stores.PDF.normalize['Roboto'])
        set['Roboto'] = stores.PDF.normalize['Roboto']

      pdfMake.addFonts(set)
    }
  }

  const create = async (options: PDFDocOptions) => {
    setVfsFonts()

    const pdf = pdfMake.createPdf(doc(options))

    await nextTick

    pdf
      .download(hooks.project.utils().exportFullName('pdf'))
      .then(() => {
        toast.success(hooks.i18n.t('toast.pdf.create'))
      })
      .catch(() => {
        toast(hooks.i18n.t('toast.pdf.error'))
      })
      .finally(() => {
        stores.ABSOLUTE.load = false
        isLoading.value = false
      })
  }

  const preview = (input: HTMLElement, options: PDFDocOptions) => {
    setVfsFonts()

    const generator = pdfMake.createPdf(doc(options))

    generator
      .getDataUrl()
      .then(
        async (data: any) => {
          const iframe = document.createElement('iframe')

          hooks.emitter.emit('pdf-preview-exists')

          await nextTick

          iframe.src = data
          iframe.style.width = '400px'
          iframe.style.height = '500px'
          iframe.style.overflow = 'hidden'

          let child = input?.lastElementChild
          while (child) {
            input?.removeChild(child)
            child = input?.lastElementChild
          }

          input?.appendChild(iframe)
        },
        () => {
          toast(hooks.i18n.t('toast.pdf.error'))
        }
      )
      .catch(() => {
        toast(hooks.i18n.t('toast.pdf.error'))
      })
      .finally(() => {
        stores.ABSOLUTE.load = false
        isLoading.value = false
      })
  }

  On.externals().PluginPDFGenerate(emitter, [
    async (options: PDFDocOptions) => {
      if (hooks.env.isEmptyProject(stores.PROJECT.name)) return

      toast.info(hooks.i18n.t('toast.generics.load'))

      stores.ABSOLUTE.load = true
      isLoading.value = true

      await nextTick

      hooks.storage.normalize().then(() => {
        create(options)
      })
    },
    () => {},
  ])

  On.externals().PluginPDFPreview(emitter, [
    async (options: PDFDocOptions) => {
      if (hooks.env.isEmptyProject(stores.PROJECT.name)) return

      stores.ABSOLUTE.load = true
      isLoading.value = true

      await nextTick
      await nextTick

      hooks.storage.normalize().then(() => {
        preview(document.querySelector('#pdf-preview-div') as any, options)
      })
    },
    () => {},
  ])
}
