import React, {useRef, useState, useEffect} from 'react';
import {
  Animated,
  Modal,
  Pressable,
  Text,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
  StyleProp,
  findNodeHandle,
  UIManager,
  Platform,
  Dimensions,
} from 'react-native';

type DropdownItem = {
  id: string;
  label: string;
  onPress: () => void;
};

interface DropdownMenuProps {
  anchorRef: React.RefObject<any>; // ref del botón que abrirá el menú
  items: DropdownItem[];
  visible: boolean;
  onRequestClose: () => void;
  width?: number;
  style?: StyleProp<ViewStyle>;
  itemStyle?: StyleProp<ViewStyle>;
  animationDuration?: number;
}

export default function Menu({
  anchorRef,
  items,
  visible,
  onRequestClose,
  width = 240,
  style,
  itemStyle,
  animationDuration = 150,
}: DropdownMenuProps) {
  const [pos, setPos] = useState<{x: number; y: number} | null>(null);
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    if (visible) {
      // medir la posición del anchor y mostrar el menú
      const anchor = anchorRef?.current;
      if (!anchor) return;

      // Algunos refs expuestos en RN tienen measureInWindow
      const measure = (anchor.measureInWindow ??
        ((cb: any) => {
          // fallback a UIManager.measure (para compatibilidad)
          const handle = findNodeHandle(anchor);
          if (!handle) return cb(0, 0, 0, 0);
          UIManager.measureInWindow(handle, cb);
        })) as (
        cb: (x: number, y: number, w: number, h: number) => void,
      ) => void;

      measure((x, y, w, h) => {
        // coloca el menú ligeramente debajo del botón
        const screen = Dimensions.get('window');
        const desiredX = Math.min(x, screen.width - width - 8); // no se salga del screen
        const desiredY = y + h + 8; // 8px debajo
        setPos({x: desiredX, y: desiredY});
        // animación de entrada
        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 1,
            duration: animationDuration,
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 1,
            duration: animationDuration,
            useNativeDriver: true,
          }),
        ]).start();
      });
    } else {
      // ocultar animación
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: animationDuration,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 0.95,
          duration: animationDuration,
          useNativeDriver: true,
        }),
      ]).start(() => setPos(null));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onRequestClose}>
      {/* Tocar fuera cierra */}
      <TouchableWithoutFeedback onPress={onRequestClose}>
        <View style={{flex: 1, backgroundColor: 'transparent'}}>
          {/* Si aún no medimos, no renderizamos el panel */}
          {pos && (
            <Animated.View
              style={[
                {
                  position: 'absolute',
                  left: pos.x,
                  top: pos.y,
                  width,
                  backgroundColor: '#fff',
                  borderRadius: 8,
                  // sombra (iOS) / elevation (Android/Windows)
                  shadowColor: '#000',
                  shadowOffset: {width: 0, height: 6},
                  shadowOpacity: 0.12,
                  shadowRadius: 12,
                  elevation: 8,
                  overflow: Platform.OS === 'ios' ? 'visible' : 'hidden',
                  transform: [{scale: scale}],
                  opacity: opacity,
                } as any,
                style,
              ]}>
              {items.map(it => (
                <Pressable
                  key={it.id}
                  onPress={() => {
                    // cierra el menú antes de ejecutar acción
                    onRequestClose();
                    // pequeño delay para que se vea el feedback
                    setTimeout(it.onPress, 50);
                  }}
                  style={({pressed}) => [
                    {
                      paddingVertical: 10,
                      paddingHorizontal: 12,
                      minHeight: 44,
                      justifyContent: 'center',
                    },
                    pressed && {backgroundColor: 'rgba(0,0,0,0.04)'},
                    itemStyle,
                  ]}>
                  <Text style={{fontSize: 14, color: '#222'}}>{it.label}</Text>
                </Pressable>
              ))}
            </Animated.View>
          )}
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
