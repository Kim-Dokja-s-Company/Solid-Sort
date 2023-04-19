/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { For, onCleanup, onMount } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import Sortable, { MultiDrag, Swap } from 'sortablejs';

import { SolidSortableProps } from './types';

// Temporary solution, will definitely use createStore in the near future
let store: {
    list: any;
    setList: any;
} = { list: null, setList: null };

Sortable.mount(new Swap(), new MultiDrag());

function SolidSortable<T>({ list, setList, children, tag = 'div', className, id, ...props }: SolidSortableProps<T>) {
    let ref: any;

    onMount(() => {
        if (props.multiDrag && props.swap) {
            throw new Error("Can't enable multi-drag and swap in the same component");
        }

        const sortable = Sortable.create(ref!, {
            ...props,
            onAdd: (event) => {
                const { newIndex, oldIndex, pullMode } = event;
                const fromList = store.list();
                const toList = list();

                toList.splice(newIndex!, 0, fromList[oldIndex!]);

                if (pullMode !== 'clone') {
                    fromList.splice(oldIndex!, 1);
                    store.setList(fromList);
                }
                setList(toList);

                if (props.onAdd) {
                    props.onAdd(event);
                }
            },
            onStart: (event) => {
                store = { list, setList };

                if (props.onStart) {
                    props.onStart(event);
                }
            },
            onEnd: (event) => {
                store = { list: null, setList: null };
                if (props.onEnd) {
                    props.onEnd(event);
                }
            },
            onUpdate: (event) => {
                const { oldIndex, newIndex, oldIndicies } = event;
                const newList = list();

                if (props.multiDrag) {
                    const elements = oldIndicies.map((element) => newList[element.index]);
                    oldIndicies.reverse().forEach((element) => newList.splice(element.index, 1));
                    newList.splice(newIndex!, 0, ...elements);
                } else if (props.swap) {
                    [newList[oldIndex!], newList[newIndex!]] = [newList[newIndex!], newList[oldIndex!]];
                } else {
                    newList.splice(newIndex!, 0, ...newList.splice(oldIndex!, 1));
                }
                setList(newList);

                if (props.onUpdate) {
                    props.onUpdate(event);
                }
            }
        });

        onCleanup(() => {
            sortable.destroy();
        });
    });

    return (
        <Dynamic component={tag} ref={ref} {...{ className, id }}>
            <For each={list()}>{(item) => children(item)}</For>
        </Dynamic>
    );
}

export default SolidSortable;
