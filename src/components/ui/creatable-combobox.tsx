'use client';

import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface CreatableComboboxProps {
  options: { label: string; value: string }[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  emptyMessage?: string;
  createMessage?: (value: string) => string;
}

export function CreatableCombobox({
  options,
  value,
  onChange,
  placeholder,
  emptyMessage,
  createMessage,
}: CreatableComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState(
    options.find((option) => option.value === value)?.label || ''
  );

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(inputValue.toLowerCase())
  );

  const showCreateOption =
    inputValue &&
    !options.some(
      (option) => option.label.toLowerCase() === inputValue.toLowerCase()
    );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value
            ? options.find((option) => option.value === value)?.label || inputValue
            : placeholder ?? 'Select or create...'}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandInput
            placeholder={placeholder ?? 'Search or create...'}
            value={inputValue}
            onValueChange={setInputValue}
          />
          <CommandList>
            <CommandEmpty>
              {emptyMessage ?? 'No options found.'}
            </CommandEmpty>
            <CommandGroup>
              {filteredOptions.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.label}
                  onSelect={(currentValue) => {
                    const selectedOption = options.find(
                      (opt) => opt.label.toLowerCase() === currentValue.toLowerCase()
                    );
                    onChange(selectedOption ? selectedOption.value : '');
                    setInputValue(selectedOption ? selectedOption.label : '');
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === option.value ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
              {showCreateOption && (
                <CommandItem
                  value={inputValue}
                  onSelect={() => {
                    onChange(inputValue);
                    setInputValue(inputValue);
                    setOpen(false);
                  }}
                >
                  <div className="flex items-center">
                    <span className="mr-2">+</span>
                    {createMessage?.(inputValue) ?? `Create "${inputValue}"`}
                  </div>
                </CommandItem>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}