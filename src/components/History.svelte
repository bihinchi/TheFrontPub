<script>
    import HistoryRecord from "./HistoryRecord.svelte";
	import { history } from '../js/stores';
    import debounce from 'lodash/debounce'
    
    // history dom element
    let scroller;
    
    // subset of shown history
    let records = [];

    const RECORDS_NUM = 20;
    
    // indeces for history subset
    let end, middle, start = 0;
    
    // used to detect if vp contains battling records
    // that can bi skipped
    const MIN5 = 900;
    let group = 0;
    
    // time of current record within history scroller
    let historytime = new Date();

    // used to detect scrolling direction
    let previousLeft = 0, scrollRight = false;

    const getSubSet = (records) => {
        if (!records.length) return records;
        end ??=  records.length > RECORDS_NUM ? RECORDS_NUM : records.length;
        return records.slice(start, end)
    }

    $: records = getSubSet($history)

    const onCenterUpdater = () => {

        const rect = scroller.getBoundingClientRect();
        const middleX = (rect.left + rect.right) / 2;

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
                
                const newMiddle = $history.findIndex((el) => el === record);

                if (newMiddle != middle) {
                    group = record.length === MIN5 ? group+1 : 0; 
                }

                middle = newMiddle;


            }
        }
    }

    const updateScroll = () =>  {

        scrollRight = scroller.scrollLeft > previousLeft;
        previousLeft = scroller.scrollLeft;

        const rect = scroller.getBoundingClientRect();
        const maxScroll = scroller.scrollWidth - rect.width;
        const step = Math.floor(RECORDS_NUM / 3);

        if (scrollRight && end < $history.length && maxScroll - scroller.scrollLeft < rect.width / 4 ) {
            
            end += step;
            start += step;
            scroller.scroll(Math.floor(scroller.scrollLeft - rect.width / 1.5), scroller.scrollTop)
            $history = $history
 
        } else if (!scrollRight && start > 0 && scroller.scrollLeft < rect.width / 4) {
            
            start -= step;
            end -= step;
            scroller.scroll(Math.floor(rect.width / 3), scroller.scrollTop);
            $history = $history
        }

        onCenterUpdater();
    }

    const skipGroup = () => {

        const index = scrollRight 
            ? 
              $history.findIndex((elem,index) => index >= middle && elem.length !== MIN5)
            :
              $history.slice(0, middle).lastIndexOf(elem => elem.length !== MIN5)


        if (index == -1) {

            // go to the edge of records
            // if competetion never ended

            if (scrollRight) {

                end = $history.length;
                start = Math.max(end - RECORDS_NUM, 0)

            } else {

                start = 0;
                end = start + RECORDS_NUM;
                
            }


        } else {

            // skip the group and put the last item
            // to the middle

            const diff = index - middle;

            start = Math.max(start + diff, 0);
            end = start == 0 ? start + RECORDS_NUM : end + diff;
        }

        group = 0;
        $history = $history
        onCenterUpdater();
    } 

    const scrollUpdater =  debounce(updateScroll, 300);

    const onScroll = () => {
        scrollUpdater();
        onCenterUpdater();
    }

    const onStartClick = () => {
        start = 0;
        end = start + RECORDS_NUM;
        group = 0;
        $history = $history
        scroller.scrollLeft = 0;
        onCenterUpdater();
    }

    const onEndClick = () => {
        end = $history.length;
        start = Math.max(end - RECORDS_NUM, 0)
        group = 0;
        $history = $history;
        scroller.scrollLeft = scroller.scrollWidth;
        onCenterUpdater();
    }
    

</script>


{ #if records.length > 3}
<div>
    <span on:click={onStartClick}>Start</span>
    <span>{historytime.toLocaleString()}</span>
    <span on:click={onEndClick}>End</span>
</div>
{ /if }

<article on:scroll={onScroll} bind:this={scroller}>

    { #if records.length > 0}
        {#each records as record }
            <HistoryRecord {record} />
        { /each }

        { #if group > 1 && $history.length >= RECORDS_NUM }  
            <span class="{ scrollRight ? 'right' : 'left' }" on:click={ skipGroup }>>></span> 
        { /if }
    { :else }
        <p class="center">No records</p>    
    { /if }


</article>

<style>

    div > span {
        font-style: italic;
    }

    article > span {
        position: absolute;
        top: 50%;
        padding: 0.5vw;
        border-radius: 0.5vw;
        border: 0.01vw solid black;
        opacity: 0.6;
    }

    article > span:hover {
        opacity: 1;
    }

    .right {
        right: 4%;
    }

    .left {
        left: 4%;
        transform: scale(-1, 1);
    }

    span:hover {
        cursor: pointer;
    }

    div {
        display: flex;
        justify-content: space-between;
        font-size: 1.2vw;
        margin-bottom: 1vh;
    }

    article {
        display: flex;
        overflow: auto;
        white-space: nowrap;
        justify-content: space-between;
        max-width: 91vw;
        min-height: 60vh;
        min-width: 24vw;
        font-size: 3.0vw;
    }

    p {
        width: 100%;
    }

    
</style>