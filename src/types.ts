import { JSX, JSXElement, Setter, Accessor } from 'solid-js';
import { SortableEvent, Options } from 'sortablejs';

export type SolidSortableProps<T> = {
    list: Accessor<T[]>;
    setList: Setter<T[]>;
    children: (item: T) => JSXElement;
} & Partial<{
    tag?: keyof JSX.IntrinsicElements;
    className?: string;
    id?: string;
}> &
    Partial<Record<SolidSortableMethod, (event: SortableEvent) => void>> &
    Omit<Options, SolidSortableMethod>;

export type SolidSortableMethod =
    | 'onAdd'
    | 'onChange'
    | 'onChoose'
    | 'onClone'
    | 'onEnd'
    | 'onFilter'
    | 'onRemove'
    | 'onSort'
    | 'onSpill'
    | 'onStart'
    | 'onUnchoose'
    | 'onUpdate'
    | 'onSelect'
    | 'onDeselect';
