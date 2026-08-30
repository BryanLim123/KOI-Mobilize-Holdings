/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import type { Subscriber } from '../../types';
import { deleteSubscriber, downloadSubscribersCSV, listSubscribers } from '../../services/contentService';
import { Button, Card, PanelHeader } from '../ui';

const SubscribersPanel: React.FC = () => {
  const [list, setList] = useState<Subscriber[] | null>(null);
  const [error, setError] = useState('');

  const refresh = async () => {
    try {
      setError('');
      setList(await listSubscribers());
    } catch (e) {
      setError((e as Error).message);
      setList([]);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const remove = async (sub: Subscriber) => {
    if (!confirm(`Remove ${sub.email}? This cannot be undone.`)) return;
    await deleteSubscriber(sub.id);
    refresh();
  };

  return (
    <div className="space-y-8">
      <PanelHeader
        title="Newsletter Subscribers"
        hint="Captured by the footer form and stored in server/data/subscribers.json. No Google Apps Script involved."
      >
        <Button variant="ghost" onClick={refresh}>
          Refresh
        </Button>
        <Button variant="primary" onClick={() => downloadSubscribersCSV().catch((e) => setError(e.message))}>
          Export CSV
        </Button>
      </PanelHeader>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      <Card className="p-0">
        {list === null ? (
          <p className="py-12 text-center text-sm text-slate-400">Loading…</p>
        ) : list.length === 0 ? (
          <p className="py-12 text-center text-sm text-slate-400">No subscribers yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-[11px] uppercase tracking-wider text-slate-500">
                <th className="px-5 py-3 font-bold">Email</th>
                <th className="px-5 py-3 font-bold">Subscribed</th>
                <th className="px-5 py-3 font-bold">Source</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {list
                .slice()
                .reverse()
                .map((sub) => (
                  <tr key={sub.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                    <td className="px-5 py-3 font-medium text-slate-800">{sub.email}</td>
                    <td className="px-5 py-3 text-slate-500">
                      {new Date(sub.createdAt).toLocaleString()}
                    </td>
                    <td className="px-5 py-3 text-slate-500">{sub.source}</td>
                    <td className="px-5 py-3 text-right">
                      <Button variant="danger" onClick={() => remove(sub)}>
                        Remove
                      </Button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
};

export default SubscribersPanel;
