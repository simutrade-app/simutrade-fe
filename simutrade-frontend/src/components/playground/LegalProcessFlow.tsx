import React, { useCallback, useMemo, useState } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  BackgroundVariant,
  MarkerType,
  Handle,
  Position,
  type Node,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { 
  FiFileText, 
  FiShield, 
  FiCheckCircle, 
  FiTruck, 
  FiGlobe,
  FiAlertTriangle,
  FiClock,
  FiDollarSign,
  FiX,
  FiLoader
} from 'react-icons/fi';

interface LegalProcessFlowProps {
  commodity?: string;
  originCountry?: string;
  destinationCountry?: string;
  transportMode?: string;
}

interface NodeDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  nodeData: any;
  commodity?: string;
  originCountry?: string;
  destinationCountry?: string;
}

// Modal component for node details
const NodeDetailModal: React.FC<NodeDetailModalProps> = ({ 
  isOpen, 
  onClose, 
  nodeData, 
  commodity,
  originCountry,
  destinationCountry 
}) => {
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('');
  const [error, setError] = useState(false);

  const fetchNodeDetails = async () => {
    if (!nodeData || content) return;
    
    setLoading(true);
    setError(false);

    try {
      const token = localStorage.getItem('authToken') || 
                   localStorage.getItem('token') || 
                   sessionStorage.getItem('authToken') ||
                   'demo-token';

      const query = `Provide detailed information about "${nodeData.label}" in the legal process for international trade of ${commodity || 'goods'} from ${originCountry || 'origin country'} to ${destinationCountry || 'destination country'}. Include required documents, timeline, potential challenges, regulatory requirements, and step-by-step procedures. Be specific and actionable.`;

      const response = await fetch('https://api.simutrade.app/service/ai-agent/vertex', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify({ query })
      });

      if (response.ok) {
        const data = await response.json();
        // Handle the nested response format: data.data.response
        const responseText = data?.data?.response 
          ? (Array.isArray(data.data.response) 
              ? data.data.response.map((item: any) => item.text || item).join('\n')
              : data.data.response)
          : data.response || 'No details available';
        setContent(responseText);
      } else {
        throw new Error('Failed to fetch details');
      }
    } catch (err) {
      setError(true);
      // Fallback content
      setContent(`**${nodeData.label}** is a critical step in the international trade legal process.\n\nKey Requirements:\n• Documentation verification\n• Regulatory compliance\n• Timeline: ${nodeData.duration || '1-3 days'}\n• Status: ${nodeData.status || 'Pending'}\n\nThis step ensures all legal requirements are met for smooth international trade operations.`);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (isOpen && nodeData) {
      fetchNodeDetails();
    }
  }, [isOpen, nodeData]);

  React.useEffect(() => {
    if (!isOpen) {
      setContent('');
      setError(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              {nodeData?.type === 'documentation' && <FiFileText className="w-5 h-5 text-primary" />}
              {nodeData?.type === 'compliance' && <FiShield className="w-5 h-5 text-primary" />}
              {nodeData?.type === 'certification' && <FiCheckCircle className="w-5 h-5 text-primary" />}
              {nodeData?.type === 'transit' && <FiTruck className="w-5 h-5 text-primary" />}
              {nodeData?.type === 'clearance' && <FiGlobe className="w-5 h-5 text-primary" />}
              {nodeData?.type === 'risk' && <FiAlertTriangle className="w-5 h-5 text-primary" />}
              {nodeData?.type === 'timeline' && <FiClock className="w-5 h-5 text-primary" />}
              {nodeData?.type === 'cost' && <FiDollarSign className="w-5 h-5 text-primary" />}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{nodeData?.label}</h2>
              <p className="text-sm text-gray-600">{nodeData?.description}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FiX className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <FiLoader className="w-6 h-6 animate-spin text-primary" />
              <span className="ml-2 text-gray-600">Loading details...</span>
            </div>
          ) : (
            <div className="prose prose-sm max-w-none">
              <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                {content.split('\n').map((line, index) => {
                  if (line.startsWith('**') && line.endsWith('**')) {
                    return <h3 key={index} className="font-semibold text-primary mt-4 mb-2">{line.slice(2, -2)}</h3>;
                  } else if (line.startsWith('•')) {
                    return <li key={index} className="ml-4">{line.slice(1).trim()}</li>;
                  } else if (line.trim()) {
                    return <p key={index} className="mb-2">{line}</p>;
                  }
                  return <br key={index} />;
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Custom node components for different legal process steps
const CustomNode = ({ data, selected }: { data: any; selected?: boolean }) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'documentation':
        return <FiFileText className="w-5 h-5" />;
      case 'compliance':
        return <FiShield className="w-5 h-5" />;
      case 'certification':
        return <FiCheckCircle className="w-5 h-5" />;
      case 'transit':
        return <FiTruck className="w-5 h-5" />;
      case 'clearance':
        return <FiGlobe className="w-5 h-5" />;
      case 'risk':
        return <FiAlertTriangle className="w-5 h-5" />;
      case 'timeline':
        return <FiClock className="w-5 h-5" />;
      case 'cost':
        return <FiDollarSign className="w-5 h-5" />;
      default:
        return <FiFileText className="w-5 h-5" />;
    }
  };

  const getNodeColor = (type: string) => {
    switch (type) {
      case 'documentation':
        return 'bg-blue-50 border-blue-300 text-blue-800';
      case 'compliance':
        return 'bg-primary/10 border-primary/30 text-primary';
      case 'certification':
        return 'bg-secondary/20 border-secondary/50 text-primary';
      case 'transit':
        return 'bg-orange-50 border-orange-300 text-orange-800';
      case 'clearance':
        return 'bg-accent/20 border-accent/50 text-primary';
      case 'risk':
        return 'bg-red-50 border-red-300 text-red-800';
      case 'timeline':
        return 'bg-indigo-50 border-indigo-300 text-indigo-800';
      case 'cost':
        return 'bg-emerald-50 border-emerald-300 text-emerald-800';
      default:
        return 'bg-gray-50 border-gray-300 text-gray-800';
    }
  };

  return (
    <div className={`px-3 py-2 shadow-md rounded-lg border-2 ${getNodeColor(data.type)} min-w-[160px] max-w-[180px] transition-all duration-200 cursor-pointer hover:shadow-lg ${ 
      selected ? 'ring-2 ring-primary ring-opacity-50 scale-105' : ''
    }`}>
      <Handle type="target" position={Position.Top} className="w-2 h-2" />
      <Handle type="source" position={Position.Bottom} className="w-2 h-2" />
      
      <div className="flex items-center gap-2 mb-1">
        {getIcon(data.type)}
        <h3 className="font-semibold text-xs">{data.label}</h3>
      </div>
      <p className="text-xs opacity-80 leading-tight">{data.description}</p>
      {data.duration && (
        <div className="mt-1 text-xs opacity-70 font-medium">
          {data.duration}
        </div>
      )}
    </div>
  );
};

const LegalProcessFlow: React.FC<LegalProcessFlowProps> = ({ 
  commodity = 'goods', 
  originCountry = 'Origin', 
  destinationCountry = 'Destination',
  transportMode = 'sea'
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState<any>(null);

  // Simplified linear flow - much cleaner positioning
  const initialNodes = useMemo(() => [
    // Main flow line (horizontal)
    {
      id: '1',
      type: 'custom',
      position: { x: 50, y: 100 },
      data: { 
        label: 'Export Documentation',
        description: `Prepare export documents for ${commodity}`,
        type: 'documentation',
        duration: '2-3 days',
        status: 'pending'
      }
    },
    {
      id: '2',
      type: 'custom',
      position: { x: 250, y: 100 },
      data: { 
        label: 'Regulatory Compliance',
        description: `Ensure compliance with ${originCountry} export laws`,
        type: 'compliance',
        duration: '1-2 days',
        status: 'pending'
      }
    },
    {
      id: '3',
      type: 'custom',
      position: { x: 450, y: 100 },
      data: { 
        label: 'Quality Certification',
        description: 'Obtain quality and safety certificates',
        type: 'certification',
        duration: '3-5 days',
        status: 'pending'
      }
    },
    {
      id: '4',
      type: 'custom',
      position: { x: 650, y: 100 },
      data: { 
        label: 'International Transit',
        description: `Transport via ${transportMode}`,
        type: 'transit',
        duration: '7-21 days',
        status: 'pending'
      }
    },
    {
      id: '5',
      type: 'custom',
      position: { x: 850, y: 100 },
      data: { 
        label: 'Import Clearance',
        description: `Clear customs in ${destinationCountry}`,
        type: 'clearance',
        duration: '1-3 days',
        status: 'pending'
      }
    },
    {
      id: '6',
      type: 'custom',
      position: { x: 1050, y: 100 },
      data: { 
        label: 'Final Delivery',
        description: 'Complete delivery and documentation',
        type: 'compliance',
        duration: '1 day',
        status: 'pending'
      }
    },
    // Monitoring nodes (below main flow)
    {
      id: '7',
      type: 'custom',
      position: { x: 250, y: 250 },
      data: { 
        label: 'Risk Monitoring',
        description: 'Monitor compliance and logistics risks',
        type: 'risk',
        duration: 'Ongoing',
        status: 'active'
      }
    },
    {
      id: '8',
      type: 'custom',
      position: { x: 550, y: 250 },
      data: { 
        label: 'Timeline Tracking',
        description: 'Track deadlines and delivery schedule',
        type: 'timeline',
        duration: 'Ongoing',
        status: 'active'
      }
    },
    {
      id: '9',
      type: 'custom',
      position: { x: 850, y: 250 },
      data: { 
        label: 'Cost Monitoring',
        description: 'Monitor costs and additional charges',
        type: 'cost',
        duration: 'Ongoing',
        status: 'active'
      }
    }
  ], [commodity, originCountry, destinationCountry, transportMode]);

  // Simplified linear edges
  const initialEdges = useMemo(() => [
    // Main flow (horizontal line)
    { id: 'e1-2', source: '1', target: '2', type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed } },
    { id: 'e2-3', source: '2', target: '3', type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed } },
    { id: 'e3-4', source: '3', target: '4', type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed } },
    { id: 'e4-5', source: '4', target: '5', type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed } },
    { id: 'e5-6', source: '5', target: '6', type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed } },
    
    // Monitoring connections (minimal, clean)
    { 
      id: 'e2-7', 
      source: '2', 
      target: '7', 
      type: 'smoothstep', 
      style: { stroke: '#ef4444', strokeDasharray: '5,5' },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#ef4444' }
    },
    { 
      id: 'e4-8', 
      source: '4', 
      target: '8', 
      type: 'smoothstep', 
      style: { stroke: '#00403D', strokeDasharray: '5,5' },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#00403D' }
    },
    { 
      id: 'e5-9', 
      source: '5', 
      target: '9', 
      type: 'smoothstep', 
      style: { stroke: '#B3CFCD', strokeDasharray: '5,5' },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#B3CFCD' }
    }
  ], []);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const nodeTypes = useMemo(() => ({
    custom: CustomNode,
  }), []);

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node.data);
    setModalOpen(true);
  }, []);

  return (
    <div className="w-full h-full bg-gradient-to-br from-gray-50 to-accent/10">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-left"
        className="rounded-lg"
        minZoom={0.2}
        maxZoom={1.5}
        defaultViewport={{ x: 0, y: 0, zoom: 0.6 }}
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} />
        <Controls 
          position="top-left"
          className="bg-white/80 backdrop-blur-sm shadow-lg"
          showZoom={true}
          showFitView={true}
          showInteractive={false}
        />
      </ReactFlow>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg text-xs">
        <h4 className="font-semibold mb-2 text-gray-800">Legend</h4>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-gray-800"></div>
            <span className="text-gray-600">Main Process Flow</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-red-500" style={{ background: 'repeating-linear-gradient(90deg, #ef4444, #ef4444 3px, transparent 3px, transparent 6px)' }}></div>
            <span className="text-gray-600">Risk Monitoring</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-primary" style={{ background: 'repeating-linear-gradient(90deg, #00403D, #00403D 3px, transparent 3px, transparent 6px)' }}></div>
            <span className="text-gray-600">Timeline Tracking</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-accent" style={{ background: 'repeating-linear-gradient(90deg, #B3CFCD, #B3CFCD 3px, transparent 3px, transparent 6px)' }}></div>
            <span className="text-gray-600">Cost Monitoring</span>
          </div>
        </div>
        <p className="text-gray-500 mt-2 italic">Click any node for details</p>
      </div>

      <NodeDetailModal 
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        nodeData={selectedNode}
        commodity={commodity}
        originCountry={originCountry}
        destinationCountry={destinationCountry}
      />
    </div>
  );
};

export default LegalProcessFlow; 