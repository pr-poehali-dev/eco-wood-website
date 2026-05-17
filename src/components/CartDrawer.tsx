import Icon from '@/components/ui/icon';

interface CartItem {
  id: string;
  name: string;
  size: string;
  price: number;
  quantity: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  items: CartItem[];
  onClose: () => void;
  onUpdateQuantity: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
  onOrder: () => void;
}

export default function CartDrawer({ isOpen, items, onClose, onUpdateQuantity, onRemove, onOrder }: CartDrawerProps) {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-eco-100">
          <div>
            <h2 className="font-display text-2xl font-semibold text-eco-800">Корзина</h2>
            {items.length > 0 && (
              <p className="text-eco-500 text-sm">{totalItems} шт · {total.toLocaleString('ru-RU')} ₽</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-eco-50 hover:bg-eco-100 text-eco-600 flex items-center justify-center transition-colors"
          >
            <Icon name="X" size={18} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-4">
              <div className="text-6xl">🛒</div>
              <div>
                <div className="font-display text-xl font-semibold text-eco-700 mb-1">Корзина пуста</div>
                <div className="text-eco-500 text-sm">Добавьте товары из каталога</div>
              </div>
              <button onClick={onClose} className="btn-primary mt-4">
                Перейти в каталог
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map(item => (
                <div key={item.id} className="bg-eco-50 rounded-2xl border border-eco-100 p-4 flex gap-4">
                  <div className="w-12 h-12 bg-wood-100 rounded-xl flex items-center justify-center text-2xl shrink-0">
                    🪵
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-eco-800 text-sm truncate">{item.name}</div>
                    <div className="text-eco-500 text-xs mt-0.5">{item.size}</div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity controls */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => item.quantity > 1 ? onUpdateQuantity(item.id, item.quantity - 1) : onRemove(item.id)}
                          className="w-7 h-7 rounded-lg bg-white border border-eco-200 hover:border-eco-400 text-eco-700 flex items-center justify-center text-sm font-bold transition-colors"
                        >
                          −
                        </button>
                        <span className="w-6 text-center text-sm font-semibold text-eco-800">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="w-7 h-7 rounded-lg bg-white border border-eco-200 hover:border-eco-400 text-eco-700 flex items-center justify-center text-sm font-bold transition-colors"
                        >
                          +
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-eco-700 text-sm">
                          {(item.price * item.quantity).toLocaleString('ru-RU')} ₽
                        </span>
                        <button
                          onClick={() => onRemove(item.id)}
                          className="w-7 h-7 rounded-lg bg-white border border-eco-200 hover:border-red-100 hover:border-red-300 text-eco-400 hover:text-red-400 flex items-center justify-center transition-colors"
                        >
                          <Icon name="Trash2" size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-eco-100 px-6 py-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-eco-600">Итого ({totalItems} шт):</span>
              <span className="font-display text-2xl font-bold text-eco-800">
                {total.toLocaleString('ru-RU')} ₽
              </span>
            </div>
            <button
              onClick={onOrder}
              className="btn-primary w-full py-4 text-base flex items-center justify-center gap-2"
            >
              <Icon name="Package" size={18} />
              Оформить заказ
            </button>
            <p className="text-eco-400 text-xs text-center">
              Менеджер свяжется с вами для подтверждения заказа
            </p>
          </div>
        )}
      </div>
    </>
  );
}
