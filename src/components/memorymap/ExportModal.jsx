import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, FileVideo, FileJson, Share2, Copy, Check, Lock } from "lucide-react";
import { motion } from "framer-motion";

export default function ExportModal({ isOpen, onClose, isDarkMode }) {
  const [format, setFormat] = useState("gif");
  const [quality, setQuality] = useState("high");
  const [isExporting, setIsExporting] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleExport = () => {
    setIsExporting(true);
    // Simulation of export process
    setTimeout(() => {
      setIsExporting(false);
      onClose();
    }, 2000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText("https://memorymap.io/share/v/8f92a3");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`sm:max-w-[500px] ${isDarkMode ? 'bg-gray-800 text-white border-gray-700' : 'bg-white'}`}>
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Download className="w-5 h-5 text-purple-500" />
            Export Visualization
          </DialogTitle>
          <DialogDescription className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
            Save your memory visualization or share it with others.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="video" className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="video">Video/GIF</TabsTrigger>
            <TabsTrigger value="report">PDF Report</TabsTrigger>
            <TabsTrigger value="share">Share</TabsTrigger>
          </TabsList>

          <TabsContent value="video" className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Format</Label>
              <div className="grid grid-cols-2 gap-4">
                <div 
                  className={`border-2 rounded-xl p-4 cursor-pointer flex flex-col items-center gap-2 transition-all ${format === 'gif' ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-purple-200'}`}
                  onClick={() => setFormat('gif')}
                >
                  <div className="bg-purple-100 dark:bg-purple-900/50 p-2 rounded-lg">
                    <FileVideo className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <span className="font-semibold">GIF Animation</span>
                  <span className="text-xs text-center opacity-60">Best for embedding in slides</span>
                </div>
                
                <div 
                  className={`border-2 rounded-xl p-4 cursor-pointer flex flex-col items-center gap-2 transition-all ${format === 'mp4' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-blue-200'}`}
                  onClick={() => setFormat('mp4')}
                >
                  <div className="bg-blue-100 dark:bg-blue-900/50 p-2 rounded-lg">
                    <FileVideo className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="font-semibold">MP4 Video</span>
                  <span className="text-xs text-center opacity-60">High quality, smaller size</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Quality</Label>
              <Select value={quality} onValueChange={setQuality}>
                <SelectTrigger className={isDarkMode ? 'bg-gray-700 border-gray-600' : ''}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High (1080p) - Pro</SelectItem>
                  <SelectItem value="medium">Medium (720p)</SelectItem>
                  <SelectItem value="low">Low (480p)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 mt-2" 
              size="lg"
              onClick={handleExport}
              disabled={isExporting}
            >
              {isExporting ? 'Generating...' : `Download ${format.toUpperCase()}`}
            </Button>
          </TabsContent>

          <TabsContent value="report" className="space-y-4 py-4">
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center">
              <FileJson className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="font-bold text-lg mb-2">Memory Analysis Report</h3>
              <p className="text-sm text-gray-500 mb-6">
                Includes stack trace, heap allocations, memory leak analysis, and execution steps.
              </p>
              <Button variant="outline" className="gap-2">
                <Lock className="w-4 h-4" />
                Unlock with Pro
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="share" className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Share Link</Label>
              <div className="flex gap-2">
                <Input 
                  value="https://memorymap.io/share/v/8f92a3" 
                  readOnly 
                  className={isDarkMode ? 'bg-gray-700 border-gray-600' : ''}
                />
                <Button onClick={handleCopyLink} variant="outline" className={copied ? "text-green-600 border-green-600" : ""}>
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Embed Code</Label>
              <div className="relative">
                <textarea 
                  className={`w-full h-24 p-3 rounded-md text-sm font-mono border resize-none ${
                    isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-300' : 'bg-gray-50 border-gray-200 text-gray-600'
                  }`}
                  readOnly
                  value={`<iframe src="https://memorymap.io/embed/v/8f92a3" width="100%" height="600" frameborder="0"></iframe>`}
                />
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="absolute top-2 right-2 h-8 w-8 p-0"
                  onClick={() => {
                    navigator.clipboard.writeText(`<iframe src="https://memorymap.io/embed/v/8f92a3" width="100%" height="600" frameborder="0"></iframe>`);
                  }}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
