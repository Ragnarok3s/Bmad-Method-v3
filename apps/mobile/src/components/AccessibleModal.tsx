import { useEffect, useRef } from 'react';
import {
  AccessibilityInfo,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  findNodeHandle
} from 'react-native';

export interface AccessibleModalProps {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  onConfirm: () => void;
  onDismiss: () => void;
  cancelLabel?: string;
  onCancel?: () => void;
  testID?: string;
  confirmAccessibilityLabel?: string;
  cancelAccessibilityLabel?: string;
}

export function AccessibleModal({
  visible,
  title,
  message,
  confirmLabel,
  onConfirm,
  onDismiss,
  cancelLabel,
  onCancel,
  testID,
  confirmAccessibilityLabel,
  cancelAccessibilityLabel
}: AccessibleModalProps): JSX.Element {
  const confirmRef = useRef<TouchableOpacity | null>(null);

  useEffect(() => {
    if (!visible) {
      return;
    }
    const timeout = setTimeout(() => {
      const node = confirmRef.current ? findNodeHandle(confirmRef.current) : null;
      if (node) {
        AccessibilityInfo.setAccessibilityFocus(node).catch(() => undefined);
      }
    }, 150);
    return () => clearTimeout(timeout);
  }, [visible]);

  const handleConfirm = (): void => {
    onConfirm();
  };

  const handleCancel = (): void => {
    if (onCancel) {
      onCancel();
    }
    onDismiss();
  };

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onDismiss}
      presentationStyle="overFullScreen"
      accessibilityViewIsModal
      testID={testID}
    >
      <View style={styles.backdrop}>
        <View style={styles.modal} accessible accessibilityRole="alert">
          <Text style={styles.title} accessibilityRole="header">
            {title}
          </Text>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.actions}>
            {cancelLabel ? (
              <TouchableOpacity
                style={[styles.button, styles.secondaryButton]}
                onPress={handleCancel}
                accessibilityRole="button"
                accessibilityLabel={cancelAccessibilityLabel ?? cancelLabel}
                focusable
                testID={testID ? `${testID}-cancel` : undefined}
              >
                <Text style={[styles.buttonText, styles.secondaryButtonText]}>{cancelLabel}</Text>
              </TouchableOpacity>
            ) : null}
            <TouchableOpacity
              ref={confirmRef}
              style={[styles.button, styles.primaryButton]}
              onPress={handleConfirm}
              accessibilityRole="button"
              accessibilityLabel={confirmAccessibilityLabel ?? confirmLabel}
              focusable
              testID={testID ? `${testID}-confirm` : undefined}
            >
              <Text style={styles.buttonText}>{confirmLabel}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(17, 24, 39, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24
  },
  modal: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    gap: 16,
    elevation: 6,
    shadowColor: '#000000',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 }
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827'
  },
  message: {
    fontSize: 16,
    color: '#374151'
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    minWidth: 120,
    alignItems: 'center'
  },
  primaryButton: {
    backgroundColor: '#2563eb'
  },
  secondaryButton: {
    backgroundColor: '#e5e7eb'
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#ffffff'
  },
  secondaryButtonText: {
    color: '#1f2937'
  }
});
