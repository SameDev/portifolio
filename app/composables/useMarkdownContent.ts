import MarkdownIt from 'markdown-it'
import katex from 'markdown-it-katex'

let markdownInstance: MarkdownIt | null = null

function getMarkdownParser(): MarkdownIt {
  if (!markdownInstance) {
    markdownInstance = new MarkdownIt({
      html: true,
      linkify: true,
      typographer: true,
      breaks: true,
    })
    
    // Adicionar suporte a KaTeX para fórmulas matemáticas
    markdownInstance.use(katex)
    
    // Customizar renderização de imagens para melhor responsividade
    const defaultImageRender = markdownInstance.renderer.rules.image!
    markdownInstance.renderer.rules.image = function(tokens, idx, _options, env, renderer) {
      tokens[idx].attrSet('class', 'blog-image')
      return defaultImageRender(tokens, idx, _options, env, renderer)
    }

    // Customizar links para abrir em nova aba
    const defaultLinkRender = markdownInstance.renderer.rules.link_open!
    markdownInstance.renderer.rules.link_open = function(tokens, idx, _options, env, renderer) {
      tokens[idx].attrSet('target', '_blank')
      tokens[idx].attrSet('rel', 'noopener noreferrer')
      return defaultLinkRender(tokens, idx, _options, env, renderer)
    }
  }
  
  return markdownInstance
}

function preprocessContent(content: string): string {
  // Converter colchetes duplos em cifrões duplos para fórmulas em bloco
  // [[formula]] → $$formula$$
  content = content.replace(/\[\[([\s\S]*?)\]\]/g, (_match, formula) => {
    return `$$\n${formula}\n$$`
  })
  
  // Converter colchetes simples em cifrões simples para fórmulas inline
  // [formula] → $formula$ (mas não se [formula] for um link!)
  // Evitar converter [texto](url) - links em markdown
  content = content.replace(/\[([^\[\]\n]*?)\](?!\()/g, (match, formula) => {
    // Verificar se parece ser uma fórmula (contém \, números, parênteses, operadores matemáticos)
    if (/[\\{}()^_|=<>+\-*/]/.test(formula) && !formula.includes('](')) {
      return `$${formula}$`
    }
    return match
  })
  
  return content
}

export function useMarkdownContent() {
  const renderMarkdown = (content: string): string => {
    const md = getMarkdownParser()
    const processedContent = preprocessContent(content)
    return md.render(processedContent)
  }

  return {
    renderMarkdown,
  }
}
