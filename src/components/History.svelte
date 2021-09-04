<script>
    import HistoryRecord from "./HistoryRecord.svelte";

    import { onMount, onDestroy } from "svelte";
	import { history } from '../js/stores';

    
    let scroller, last, records = [], start = 0, end, historytime = new Date();

    const getSubSet = (records) => {
        if (!records.length) return records;
        end ??=  records.length > 10 ? 10 : records.length;
        return records.slice(start, end)
    }

    $: records = getSubSet($history)

    // onDestroy(history.subscribe((value) => records = value));


    const updateMiddle = () => {


        let rect = scroller.getBoundingClientRect();
        let middleX = (rect.left + rect.right) / 2;

        for (let index = 0; index < records.length; index++) {

            const record = records[index];
            const recordDom = scroller.children[index];

            if (recordDom.children.length == 0) continue;

            let recordRect = recordDom.getBoundingClientRect();

            if (recordRect.left < middleX &&  middleX < recordRect.right) {


                const m = (record.endTime - record.startTime) 
                        / (recordRect.right - recordRect.left);

                const b = record.startTime - recordRect.left * m;

                historytime = new Date(middleX * m + b)

            }
        }

        if (records.length > end && records[records.length-1].left - rect.right < rect.width) {
            start++;
            end++;
        } else if (0 < start && records[0]) {
            
        }
    }

    

</script>

<div>
    <h4>{historytime.toLocaleString()}</h4>
</div>

<article on:scroll={updateMiddle} bind:this={scroller}>

    {#each records as record }
        <HistoryRecord {record} />
    { /each }

</article>

<style>

    div {
        display: flex;
        justify-content: center;
        font-size: 1.2vw;
    }

    article {
        display: flex;
        overflow: auto;
        white-space: nowrap;
        justify-content: space-between;
        max-width: 91vw;
        min-height: 60vh;
        font-size: 3.0vw;

    }

    
</style>