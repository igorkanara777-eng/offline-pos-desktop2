
import { useEffect, useState } from 'react';

type Item = { id: number; name: string; price: number; stock: number };

export default function App() {
  const [items, setItems] = useState<Item[]>([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');

  async function refresh() {
    const data = await window.api.listItems();
    setItems(data);
  }

  useEffect(() => { refresh(); }, []);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    const n = name.trim();
    const p = Number(price);
    const s = Number(stock || 0);
    if (!n || Number.isNaN(p)) return;
    await window.api.addItem({ name: n, price: p, stock: s });
    setName(''); setPrice(''); setStock('');
    refresh();
  }

  return (
    <div style={{ padding: 24, fontFamily: 'ui-sans-serif, system-ui, Arial' }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 16 }}>Offline POS — учёт товара</h1>

      <form onSubmit={add} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: 8, maxWidth: 800 }}>
        <input placeholder="Название" value={name} onChange={e => setName(e.target.value)}
               style={{ padding: '8px 10px', border: '1px solid #ccc', borderRadius: 6 }} />
        <input placeholder="Цена" value={price} onChange={e => setPrice(e.target.value)}
               style={{ padding: '8px 10px', border: '1px solid #ccc', borderRadius: 6 }} />
        <input placeholder="Остаток" value={stock} onChange={e => setStock(e.target.value)}
               style={{ padding: '8px 10px', border: '1px solid #ccc', borderRadius: 6 }} />
        <button style={{ padding: '8px 14px', borderRadius: 6, background: '#111', color: '#fff' }}>Добавить</button>
      </form>

      <div style={{ marginTop: 20, border: '1px solid #e5e7eb', borderRadius: 8, overflow: 'hidden', maxWidth: 800 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#f3f4f6' }}>
            <tr>
              <th style={{ textAlign: 'left', padding: 10, borderBottom: '1px solid #e5e7eb' }}>ID</th>
              <th style={{ textAlign: 'left', padding: 10, borderBottom: '1px solid #e5e7eb' }}>Название</th>
              <th style={{ textAlign: 'right', padding: 10, borderBottom: '1px solid #e5e7eb' }}>Цена</th>
              <th style={{ textAlign: 'right', padding: 10, borderBottom: '1px solid #e5e7eb' }}>Остаток</th>
            </tr>
          </thead>
          <tbody>
            {items.map(row => (
              <tr key={row.id}>
                <td style={{ padding: 10, borderBottom: '1px solid #f3f4f6' }}>{row.id}</td>
                <td style={{ padding: 10, borderBottom: '1px solid #f3f4f6' }}>{row.name}</td>
                <td style={{ padding: 10, borderBottom: '1px solid #f3f4f6', textAlign: 'right' }}>{row.price.toFixed(2)}</td>
                <td style={{ padding: 10, borderBottom: '1px solid #f3f4f6', textAlign: 'right' }}>{row.stock}</td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr><td colSpan={4} style={{ padding: 16, textAlign: 'center', color: '#6b7280' }}>Пусто. Добавьте первый товар.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
