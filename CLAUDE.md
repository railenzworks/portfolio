## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:
- When graphify-out/graph.json exists, run `graphify query "<question>"` before your first grep, search or source-file read for a codebase question, and put this rule in every subagent prompt that explores code. Read raw files only for lines the graph or an earlier read already located. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. When the answer is under a Markdown heading, `graphify section "<heading>"` prints that section's text, so the .md need not be opened. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
- A committed graphify-out/graph.json is rewritten whole on every build, so a large diff to it in a pull request is expected. Do not flag it as churn or suggest skipping the graph rebuild or its hooks.

## Navegación del código: usar graphify (OBLIGATORIO)

Está **prohibido** explorar el proyecto con `ls`, `cat`, `head`, `tail`, `find`, `grep` o lecturas de archivos "a ciegas". Usa siempre el grafo de conocimiento (`graphify-out/`) primero:

1. **Antes de cualquier pregunta sobre el código** (dónde está algo, cómo se conectan componentes, qué afecta un cambio):
   - `graphify query "<pregunta>"` — búsqueda general en el grafo.
   - `graphify explain "<concepto o componente>"` — explicación de un nodo y sus vecinos.
   - `graphify path "<A>" "<B>"` — relación entre dos nodos.
   - `graphify affected "<X>"` — qué se rompe si cambio X.
2. Lee archivos fuente **solo** las líneas/archivos que el grafo ya haya localizado (usa `Read` con offset/limit).
3. `graphify-out/GRAPH_REPORT.md` solo para visión general de arquitectura.
4. Esta regla aplica también a los subagentes: inclúyela en sus prompts.

### Mantener el grafo actualizado (OBLIGATORIO)

Tras **cada** cambio de código (crear, editar, borrar o mover archivos), antes de dar la tarea por terminada, ejecuta:

```bash
graphify update .
```

(Solo AST, sin LLM, sin coste.) Los hooks de git (`post-commit`, `post-checkout`, `post-merge`) también lo relanzan, pero no sustituyen este paso durante la sesión.

### Qué se versiona

Solo `graphify-out/graph.json` y `graphify-out/GRAPH_REPORT.md`. El resto (`cache/`, `graph.html`, `manifest.json`) está en `.gitignore`. Si falta `graphify-out/`, regenerar con `graphify update .`.
