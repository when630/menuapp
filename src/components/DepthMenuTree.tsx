import React, { useState, useEffect } from 'react';
import axios from 'axios';
import sampleImage from "./sample.png";

type TreeNodeType = {
  depth1: string;
  depth2: string;
  depth3: string;
};

const DepthMenuTree = () => {
  const [menuData, setMenuData] = useState<TreeNodeType[]>([]);
  const [selectedDepth1, setSelectedDepth1] = useState<string | null>(null); // 클릭된 것
  const [hoveredDepth1, setHoveredDepth1] = useState<string | null>(null); // 마우스 올라간 것
  const [selectedDepth2, setSelectedDepth2] = useState<string | null>(null);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
        try {
        const sheetId = '1EykQ3pIukt77tUlACLtbznunBpywW1WRZUq1pdg_VXA';
        const gid = 'db';
        const url = `https://opensheet.elk.sh/${sheetId}/${gid}`;
        const res = await axios.get<TreeNodeType[]>(url);

        const filledData: TreeNodeType[] = [];
        let lastD1 = '';
        let lastD2 = '';

        for (const row of res.data) {
            const d1 = row.depth1 || lastD1;
            const d2 = row.depth2 || lastD2;
            filledData.push({ depth1: d1, depth2: d2, depth3: row.depth3 });

            if (row.depth1) lastD1 = row.depth1;
            if (row.depth2) lastD2 = row.depth2;
        }

        setMenuData(filledData);
        } catch (err) {
        console.error('시트 불러오기 실패', err);
        }
    };

    fetchData();
    }, []);

  const depth1List = Array.from(new Set(menuData.map(item => item.depth1)));
  const depth2List = selectedDepth1
    ? Array.from(new Set(menuData.filter(item => item.depth1 === selectedDepth1).map(item => item.depth2)))
    : [];

  const depth3List = selectedDepth1 && selectedDepth2
    ? menuData.filter(item => item.depth1 === selectedDepth1 && item.depth2 === selectedDepth2).map(item => item.depth3)
    : [];

  return (
    <>
      <div className="navbar">
        {depth1List.map((d1) => (
          <div
            key={d1}
            className={`nav-item ${
              (hoveredDepth1 ?? selectedDepth1) === d1 ? 'active' : ''
            }`}
            onClick={() => {
              setSelectedDepth1(d1);
              setSelectedDepth2(null); // 클릭 시 초기화
        }}
        onMouseEnter={() => setHoveredDepth1(d1)}
        onMouseLeave={() => setHoveredDepth1(null)}
        >
        {d1}
          </div>
        ))}
      </div>

      {selectedDepth1 && (
        <div className="submenu">
          {depth2List.map((d2) => (
            <div
            key={d2}
            className={`depth2-option ${selectedDepth2 === d2 ? 'active' : ''}`}
            onClick={() => setSelectedDepth2(d2)}
            >
            {d2}
            </div>
          ))}
        </div>
      )}

      {selectedDepth2 && (
        <div className="depth3-content">
          <h3>{selectedDepth2} 목록</h3>
          <ul className="depth3-list">
          {depth3List.map((d3, idx) => (
            <li
              key={idx}
              data-label={d3}
              onClick={() => setSelectedCard(d3)}
            >
              <img src={sampleImage} alt={d3} className="card-image" />
            </li>
          ))}
          </ul>
        </div>
      )}

      {selectedCard && (
        <div className="modal-overlay" onClick={() => setSelectedCard(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">{selectedCard}</span>
              <button className="modal-close" onClick={() => setSelectedCard(null)}>×</button>
            </div>
            <div className="modal-body">
              <img src={sampleImage} alt={selectedCard} className="modal-image" />
            </div>
            <div className="modal-footer">
              <button className="btn edit">수정하기</button>
              <button className="btn send">내 파일로 보내기</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DepthMenuTree;