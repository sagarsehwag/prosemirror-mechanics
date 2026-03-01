'use client';

import React from 'react';
import { CodeBlock, Code, Card, CardHeader, CardContent } from '../../ui';

export default function ProseMirrorSchema() {
  return (
    <div className='schema-tab'>
      <Card className='prosemirror-section schema-intro'>
        <CardHeader>
          <h3>Model</h3>
        </CardHeader>
        <CardContent>
          <p>
            Every Prosemirror document conforms to a <strong>schema</strong>. It
            defines which node types exist, what they can contain, and which
            marks are allowed. Invalid content is discarded.
          </p>
        </CardContent>
      </Card>

      <Card className='prosemirror-section'>
        <CardHeader>
          <h4>Example Document First</h4>
        </CardHeader>
        <CardContent>
          <p>
            Here&apos;s what a Prosemirror document actually looks like: the
            real data shape. We&apos;ll explain how the schema defines and
            enforces this structure below.
          </p>
          <div className='code-snippet doc-json-snippet'>
            <CodeBlock
              language='json'
              code={`{
  "type": "doc",
  "content": [
    {
      "type": "paragraph",
      "content": [
        { "type": "text", "text": "Hello ", "marks": [] },
        { "type": "text", "text": "world", "marks": [{ "type": "strong" }] }
      ]
    },
    {
      "type": "blockquote",
      "content": [
        {
          "type": "paragraph",
          "content": [
            { "type": "text", "text": "A quote.", "marks": [] }
          ]
        }
      ]
    }
  ]
}`}
            />
          </div>
          <p className='section-note'>
            <strong>What you&apos;re seeing:</strong> <Code>doc</Code> contains
            blocks (paragraph, blockquote). Paragraphs contain inline content
            (text with optional marks). The schema defines these rules.
          </p>
        </CardContent>
      </Card>

      <Card className='prosemirror-section'>
        <CardHeader>
          <h4>The Schema That Allows It</h4>
        </CardHeader>
        <CardContent>
          <p>
            This schema defines the rules. Every document like the one above
            must conform to it.
          </p>
          <div className='code-snippet doc-json-snippet schema-example'>
            <CodeBlock
              code={`const schema = new Schema({
  nodes: {
    doc:         { content: "block+" },
    paragraph:   { content: "inline*", group: "block" },
    blockquote:  { content: "block+", group: "block" },
    heading:     { content: "inline*", group: "block", attrs: { level: { default: 1 } } },
    code_block:  { content: "text*", group: "block", marks: "" },
    horizontal_rule: { group: "block" },
    text:        { inline: true }
  },
  marks: {
    strong: {},
    em: {},
    link: { attrs: { href: {} } }
  }
});`}
            />
          </div>
        </CardContent>
      </Card>

      <Card className='prosemirror-section'>
        <CardHeader>
          <h4>How It Works</h4>
        </CardHeader>
        <CardContent>
          <p>
            Each node type has a <strong>rule</strong> that says what it can
            contain. When you add or paste content, Prosemirror checks: does
            this match the rule? If not, it gets rejected or fixed.
          </p>

          <div className='schema-invalid-valid'>
            <div className='schema-compare-panel invalid'>
              <h5>❌ Invalid</h5>
              <p>
                Raw text directly in <Code>doc</Code>
              </p>
              <div className='schema-mini-tree'>
                <span className='node'>doc</span>
                <span className='arrow'>→</span>
                <span className='node bad'>&quot;Hello&quot;</span>
              </div>
              <p className='hint'>
                doc only accepts blocks (paragraph, blockquote, etc.), not raw
                text.
              </p>
            </div>
            <div className='schema-compare-panel valid'>
              <h5>✅ Valid</h5>
              <p>
                Text wrapped in a <Code>paragraph</Code>
              </p>
              <div className='schema-mini-tree'>
                <span className='node'>doc</span>
                <span className='arrow'>→</span>
                <span className='node'>paragraph</span>
                <span className='arrow'>→</span>
                <span className='node good'>&quot;Hello&quot;</span>
              </div>
              <p className='hint'>
                paragraph accepts inline content (text, marks). Rules satisfied.
              </p>
            </div>
          </div>

          <p className='schema-rules-summary'>
            <strong>In plain terms:</strong> <Code>doc</Code> = &quot;I only
            take blocks.&quot; <Code>paragraph</Code> = &quot;I take text (with
            optional bold/italic).&quot; <Code>blockquote</Code> = &quot;I take
            blocks.&quot; The tree below shows a valid document that follows
            these rules.
          </p>

          <div className='schema-result-tree'>
            <div className='schema-tree-title'>Valid document structure</div>
            <div className='schema-tree'>
              <div className='schema-tree-node root'>
                <span className='node-name'>doc</span>
                <span className='node-rule'>accepts blocks only</span>
              </div>
              <div className='schema-tree-children'>
                <div className='schema-tree-node'>
                  <span className='node-name'>paragraph</span>
                  <span className='node-rule'>accepts text + marks</span>
                  <div className='schema-tree-children inline'>
                    <span className='inline-placeholder'>text + marks</span>
                  </div>
                </div>
                <div className='schema-tree-node'>
                  <span className='node-name'>blockquote</span>
                  <span className='node-rule'>accepts blocks only</span>
                  <div className='schema-tree-children'>
                    <div className='schema-tree-node'>
                      <span className='node-name'>paragraph</span>
                      <span className='node-rule'>accepts text + marks</span>
                      <div className='schema-tree-children inline'>
                        <span className='inline-placeholder'>text + marks</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className='prosemirror-section'>
        <CardHeader>
          <h4>Content Expression Syntax</h4>
        </CardHeader>
        <CardContent>
          <p>
            The <Code>content</Code> field uses a regex-like syntax to specify
            valid child sequences.
          </p>
          <div className='content-expr-grid'>
            <div className='content-expr-item'>
              <Code>paragraph</Code>
              <span>Exactly one paragraph</span>
            </div>
            <div className='content-expr-item'>
              <Code>block+</Code>
              <span>One or more block nodes</span>
            </div>
            <div className='content-expr-item'>
              <Code>inline*</Code>
              <span>Zero or more inline nodes</span>
            </div>
            <div className='content-expr-item'>
              <Code>caption?</Code>
              <span>Zero or one caption</span>
            </div>
            <div className='content-expr-item'>
              <Code>paragraph | blockquote</Code>
              <span>Either paragraph or blockquote</span>
            </div>
            <div className='content-expr-item'>
              <Code>heading paragraph+</Code>
              <span>Heading, then one or more paragraphs</span>
            </div>
            <div className='content-expr-item'>
              <Code>block{'{2}'}</Code>
              <span>Exactly 2 blocks</span>
            </div>
            <div className='content-expr-item'>
              <Code>block{'{1,5}'}</Code>
              <span>1 to 5 blocks</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className='prosemirror-section'>
        <CardHeader>
          <h4>Node Groups</h4>
        </CardHeader>
        <CardContent>
          <p>
            Add <Code>group: &quot;block&quot;</Code> to node specs. Use{' '}
            <Code>block+</Code> in content expressions instead of listing types.
          </p>
          <div className='schema-groups-visual'>
            <div className='group-equivalence'>
              <Code>block+</Code>
              <span className='equiv-arrow'>≡</span>
              <Code>
                (paragraph | blockquote | heading | code_block |
                horizontal_rule)+
              </Code>
            </div>
            <div className='group-members'>
              <span className='group-tag'>block group</span>
              <span className='group-member'>paragraph</span>
              <span className='group-member'>blockquote</span>
              <span className='group-member'>heading</span>
              <span className='group-member'>code_block</span>
              <span className='group-member'>horizontal_rule</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className='prosemirror-section'>
        <CardHeader>
          <h4>Marks: Per-Node Control</h4>
        </CardHeader>
        <CardContent>
          <p>
            By default, nodes with inline content allow <strong>all</strong>{' '}
            marks. But some nodes shouldn&apos;t. Headings often stay plain,
            and <Code>code_block</Code> should never have bold or links. Use the{' '}
            <Code>marks</Code> property on a node spec to control which marks
            are allowed.
          </p>
          <div className='content-expr-grid'>
            <div className='content-expr-item'>
              <Code>marks: &quot;_&quot;</Code>
              <span>
                Wildcard: all marks allowed (default for inline content)
              </span>
            </div>
            <div className='content-expr-item'>
              <Code>marks: &quot;&quot;</Code>
              <span>Empty string: no marks (plain text only)</span>
            </div>
            <div className='content-expr-item'>
              <Code>marks: &quot;strong em link&quot;</Code>
              <span>Space-separated list: only these marks allowed</span>
            </div>
          </div>
          <div className='code-snippet doc-json-snippet'>
            <CodeBlock
              code={`// Paragraph: bold, italic, links allowed
paragraph:  { content: "inline*", group: "block", marks: "_" }

// Heading: no formatting (clean titles)
heading:    { content: "inline*", group: "block", marks: "" }

// Code block: plain text only (no bold, links, etc.)
code_block: { content: "text*", group: "block", marks: "" }`}
            />
          </div>
          <p className='section-note'>
            The value is a space-separated string of mark names or mark groups.
            Invalid marks are stripped during transforms. For example, pasting
            formatted text into a <Code>code_block</Code> loses the formatting.
          </p>
        </CardContent>
      </Card>

      <Card className='prosemirror-section schema-takeaways'>
        <CardHeader>
          <h4>What you should know</h4>
        </CardHeader>
        <CardContent>
          <ul className='schema-learn-list'>
            <li>
              <strong>Content expressions:</strong> Regex-like: <Code>+</Code>{' '}
              one or more, <Code>*</Code> zero or more, <Code>|</Code> choice.
            </li>
            <li>
              <strong>Node groups:</strong>{' '}
              <Code>group: &quot;block&quot;</Code> lets you write{' '}
              <Code>block+</Code> instead of listing types.
            </li>
            <li>
              <strong>Order matters:</strong> When filling required content,
              Prosemirror uses the first type in the expression.
            </li>
            <li>
              <strong>block+ for doc:</strong> Require at least one block so
              empty nodes don&apos;t collapse in the browser.
            </li>
            <li>
              <strong>Required types:</strong> Every schema must define a
              top-level node (default <Code>doc</Code>) and a <Code>text</Code>{' '}
              type.
            </li>
            <li>
              <strong>DOM is derived:</strong> The view renders from state.
              State is never parsed from the DOM.
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
