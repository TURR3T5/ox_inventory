import { Locale } from '../../store/locale';
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface Props {
  infoVisible: boolean;
  setInfoVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const UsefulControls: React.FC<Props> = ({ infoVisible, setInfoVisible }) => {
  return (
    <Dialog open={infoVisible} onOpenChange={setInfoVisible}>
      <DialogContent className="bg-game-primary text-game-text w-[450px] border-none">
        <DialogHeader>
          <div className="flex w-full justify-between items-center">
            <DialogTitle className="text-lg">{Locale.ui_usefulcontrols || 'Useful controls'}</DialogTitle>
            <Button
              onClick={() => setInfoVisible(false)}
              variant="ghost"
              size="icon"
              className="w-6 h-6 p-1.5 hover:bg-game-secondary-highlight"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>
        <div className="flex flex-col gap-5">
          <div>
            <kbd className="px-2 py-1 bg-gray-700 rounded text-sm">RMB</kbd>
            <br />
            {Locale.ui_rmb}
          </div>
          <div>
            <kbd className="px-2 py-1 bg-gray-700 rounded text-sm">ALT + LMB</kbd>
            <br />
            {Locale.ui_alt_lmb}
          </div>
          <div>
            <kbd className="px-2 py-1 bg-gray-700 rounded text-sm">CTRL + LMB</kbd>
            <br />
            {Locale.ui_ctrl_lmb}
          </div>
          <div>
            <kbd className="px-2 py-1 bg-gray-700 rounded text-sm">SHIFT + Drag</kbd>
            <br />
            {Locale.ui_shift_drag}
          </div>
          <div>
            <kbd className="px-2 py-1 bg-gray-700 rounded text-sm">CTRL + SHIFT + LMB</kbd>
            <br />
            {Locale.ui_ctrl_shift_lmb}
          </div>
          <div className="text-right text-2xl">🐂</div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UsefulControls;
