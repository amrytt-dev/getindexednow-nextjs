import React, { useRef, useEffect, useState } from 'react';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  Quote,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Indent,
  Outdent,
  Link,
  Unlink,
  Undo,
  Redo,
  Image,
  Heading1,
  Heading2,
  Heading3,
  Eraser
} from 'lucide-react';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function RichTextEditor({ value, onChange, placeholder, className }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    updateValue();
  };

  const updateValue = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
    updateValue();
  };

  const handleLink = () => {
    if (showLinkInput) {
      if (linkUrl) {
        execCommand('createLink', linkUrl);
      }
      setShowLinkInput(false);
      setLinkUrl('');
    } else {
      setShowLinkInput(true);
    }
  };

  const removeLink = () => {
    execCommand('unlink');
  };

  const applyHeading = (level: 1 | 2 | 3) => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    const range = selection.getRangeAt(0);
    if (!editorRef.current || !editorRef.current.contains(range.startContainer)) return;

    // 1) Try native command first
    document.execCommand('formatBlock', false, `H${level}`);

    // 2) Verify result; if not applied, do a DOM fallback wrap
    const anchorNode = selection.anchorNode as Node | null;
    const container = (anchorNode && (anchorNode.nodeType === Node.TEXT_NODE ? anchorNode.parentElement : anchorNode as Element)) || undefined;
    const closestHeading = container?.closest && container.closest('h1, h2, h3');
    if (closestHeading && closestHeading.tagName.toLowerCase() === `h${level}`) {
      updateValue();
      return;
    }

    // Fallback: wrap selection contents with a heading
    const newHeading = document.createElement(`h${level}`);
    try {
      // Surround if selection is well-formed
      newHeading.appendChild(range.extractContents());
      range.insertNode(newHeading);
    } catch {
      // If surround fails (partial nodes), replace closest block
      let node: Node = range.startContainer;
      if (node.nodeType === Node.TEXT_NODE && node.parentElement) node = node.parentElement;
      const block = (node as Element).closest('h1, h2, h3, h4, h5, h6, p, div');
      if (block) {
        newHeading.innerHTML = block.innerHTML;
        block.replaceWith(newHeading);
      }
    }

    // Move caret to end of the new heading
    const sel = window.getSelection();
    if (sel) {
      sel.removeAllRanges();
      const r = document.createRange();
      r.selectNodeContents(newHeading);
      r.collapse(false);
      sel.addRange(r);
    }

    updateValue();
  };

  const insertImageFromFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      execCommand('insertImage', dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const toggleBlockquote = () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    const range = selection.getRangeAt(0);
    if (!editorRef.current || !editorRef.current.contains(range.startContainer)) return;

    let node: Node = range.startContainer;
    if (node.nodeType === Node.TEXT_NODE && (node as any).parentElement) node = (node as any).parentElement as Element;
    const existing = (node as Element).closest('blockquote');
    if (existing) {
      const p = document.createElement('p');
      p.innerHTML = existing.innerHTML;
      existing.replaceWith(p);
      updateValue();
      return;
    }

    const bq = document.createElement('blockquote');
    try {
      bq.appendChild(range.extractContents());
      range.insertNode(bq);
    } catch {
      const block = (node as Element).closest('h1, h2, h3, h4, h5, h6, p, div');
      if (block) {
        bq.innerHTML = block.innerHTML;
        block.replaceWith(bq);
      }
    }

    const sel = window.getSelection();
    if (sel) {
      sel.removeAllRanges();
      const r = document.createRange();
      r.selectNodeContents(bq);
      r.collapse(false);
      sel.addRange(r);
    }
    updateValue();
  };

  const toolbarButtons: Array<{ icon: any; command: string; title: string; value?: string }> = [
    { icon: Bold, command: 'bold', title: 'Bold' },
    { icon: Italic, command: 'italic', title: 'Italic' },
    { icon: Underline, command: 'underline', title: 'Underline' },
    { icon: Strikethrough, command: 'strikeThrough', title: 'Strikethrough' },
    { icon: Code, command: 'formatBlock', title: 'Code Block', value: 'PRE' },
    { icon: Quote, command: 'formatBlock', title: 'Blockquote', value: 'BLOCKQUOTE' },
    { icon: List, command: 'insertUnorderedList', title: 'Bullet List' },
    { icon: ListOrdered, command: 'insertOrderedList', title: 'Numbered List' },
    { icon: AlignLeft, command: 'justifyLeft', title: 'Align Left' },
    { icon: AlignCenter, command: 'justifyCenter', title: 'Align Center' },
    { icon: AlignRight, command: 'justifyRight', title: 'Align Right' },
    { icon: AlignJustify, command: 'justifyFull', title: 'Justify' },
    { icon: Indent, command: 'indent', title: 'Indent' },
    { icon: Outdent, command: 'outdent', title: 'Outdent' },
  ];

  return (
    <div className={`border rounded-md ${className}`}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b bg-gray-50">
        {/* Undo/Redo */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => execCommand('undo')}
          title="Undo"
          className="h-8 w-8 p-0"
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => execCommand('redo')}
          title="Redo"
          className="h-8 w-8 p-0"
        >
          <Redo className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {toolbarButtons.map(({ icon: Icon, command, title, value }) => (
          <Button
            key={command}
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => execCommand(command, value)}
            title={title}
            className="h-8 w-8 p-0"
          >
            <Icon className="h-4 w-4" />
          </Button>
        ))}
        
        <div className="w-px h-6 bg-gray-300 mx-1" />
        
        {/* Headings */}
        <Button type="button" variant="ghost" size="sm" onClick={() => execCommand('formatBlock', 'P')} title="Paragraph" className="h-8 px-2 text-xs font-medium">
          P
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => applyHeading(1)} title="Heading 1" className="h-8 w-8 p-0">
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => applyHeading(2)} title="Heading 2" className="h-8 w-8 p-0">
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => applyHeading(3)} title="Heading 3" className="h-8 w-8 p-0">
          <Heading3 className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleLink}
          title="Insert Link"
          className="h-8 w-8 p-0"
        >
          <Link className="h-4 w-4" />
        </Button>
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={removeLink}
          title="Remove Link"
          className="h-8 w-8 p-0"
        >
          <Unlink className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Blockquote toggle */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={toggleBlockquote}
          title="Blockquote (toggle)"
          className="h-8 w-8 p-0"
        >
          <Quote className="h-4 w-4" />
        </Button>

        {/* Colors */}
        <input
          type="color"
          title="Text Color"
          onChange={(e) => execCommand('foreColor', e.target.value)}
          className="w-8 h-8 p-0 border rounded cursor-pointer"
        />
        <input
          type="color"
          title="Highlight"
          onChange={(e) => execCommand('hiliteColor', e.target.value)}
          className="w-8 h-8 p-0 border rounded cursor-pointer"
        />

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Image */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          title="Insert Image"
          className="h-8 w-8 p-0"
        >
          <Image className="h-4 w-4" />
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) insertImageFromFile(file);
            e.currentTarget.value = '';
          }}
        />

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Clear formatting */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => execCommand('removeFormat')}
          title="Clear Formatting"
          className="h-8 w-8 p-0"
        >
          <Eraser className="h-4 w-4" />
        </Button>
      </div>

      {/* Link Input */}
      {showLinkInput && (
        <div className="p-2 border-b bg-gray-50">
          <div className="flex gap-2">
            <Input
              placeholder="Enter URL..."
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              className="flex-1"
            />
            <Button size="sm" onClick={handleLink}>
              Insert
            </Button>
            <Button size="sm" variant="outline" onClick={() => setShowLinkInput(false)}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={updateValue}
        onPaste={handlePaste}
        onBlur={updateValue}
        className="rte-content min-h-[300px] p-4 focus:outline-none max-w-none"
        style={{ 
          minHeight: '300px',
          maxHeight: '600px',
          overflowY: 'auto',
          outline: 'none'
        }}
      />
    </div>
  );
}
