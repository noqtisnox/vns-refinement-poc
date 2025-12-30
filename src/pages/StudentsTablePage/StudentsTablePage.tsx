import React, { useEffect, useState } from 'react';

type Participant = {
    id: number;
    fullname: string;
    recordid: number;
    submitted: boolean;
    requiregrading: boolean;
    grantedextension: boolean;
    submissionstatus: string;
};

const StudentsTablePage: React.FC = () => {
    const params = new URLSearchParams(window.location.search);
    const assignmentId = params.get('id') ?? '';

    const [participants, setParticipants] = useState<Participant[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;

        const fetchParticipants = async () => {
            try {
                const res = await fetch(`/mod/assign/service.php?info=mod_assign_list_participants`);
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const json = await res.json();
                const data = Array.isArray(json) && json.length > 0 && json[0].data ? json[0].data : [];
                if (mounted) setParticipants(data as Participant[]);
            } catch (e: any) {
                if (mounted) setError(e.message ?? 'Failed to load participants');
            } finally {
                if (mounted) setLoading(false);
            }
        };

        fetchParticipants();
        return () => {
            mounted = false;
        };
    }, []);

    return (
        <div>
            <h2>Students Table Page for Assignment #{assignmentId}</h2>

            {loading && <div>Loading participants…</div>}
            {error && <div style={{ color: 'red' }}>Error: {error}</div>}

            {!loading && !error && (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th style={{ textAlign: 'left', borderBottom: '1px solid #ccc' }}>ID</th>
                            <th style={{ textAlign: 'left', borderBottom: '1px solid #ccc' }}>Full name</th>
                            <th style={{ textAlign: 'left', borderBottom: '1px solid #ccc' }}>Submission</th>
                            <th style={{ textAlign: 'left', borderBottom: '1px solid #ccc' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {participants.map((p) => (
                            <tr key={p.id}>
                                <td style={{ padding: '8px 4px' }}>{p.id}</td>
                                <td style={{ padding: '8px 4px' }}>{p.fullname}</td>
                                <td style={{ padding: '8px 4px' }}>{p.submissionstatus}</td>
                                <td style={{ padding: '8px 4px' }}>
                                    <a href={`/mod/assign/view.php?id=12345&action=grader&userid=${p.id}`}>Grade</a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default StudentsTablePage;